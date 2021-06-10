import { stringArg, extendType, nonNull } from 'nexus'
import { compare, hash } from 'bcrypt'
import { generateAccessToken, returnError } from '../../utils/helpers'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'SignupResult',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { name, email, password }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          const user = await ctx.prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
            },
          })

          const accessToken = generateAccessToken(user.id)
          return {
            __typename: 'AuthPayload',
            accessToken,
            user,
          }
        } catch (e) {
          return returnError('userAlreadyExists')
        }
      },
    })

    t.field('login', {
      type: 'LoginResult',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { email, password }, ctx) {
        let user = null
        try {
          user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          })
        } catch (e) {
          return returnError('invalidUser')
        }

        if (!user) return returnError('invalidUser')

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) return returnError('invalidUser')

        const accessToken = generateAccessToken(user.id)
        return {
          __typename: 'AuthPayload',
          accessToken,
          user,
        }
      },
    })
  },
})
