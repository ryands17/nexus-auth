import { mutationField, stringArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { createTokens, handleError } from '../../utils/helpers'

export const signup = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    name: stringArg({ nullable: true }),
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_, { name, email, password }, ctx) => {
    const hashedPassword = await hash(password, 10)
    const user = await ctx.photon.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const { accessToken, refreshToken } = createTokens(user.id)
    ctx.response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    return {
      accessToken,
      user,
    }
  },
})

export const login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_, { email, password }, ctx) => {
    try {
      const user = await ctx.photon.users.findOne({
        where: {
          email,
        },
      })
      if (!user) throw Error()

      const passwordValid = await compare(password, user.password)
      if (!passwordValid) throw Error()

      const { accessToken, refreshToken } = createTokens(user.id)
      ctx.response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
      })
      return {
        accessToken,
        user,
      }
    } catch (e) {
      handleError('Invalid username or password')
    }
  },
})
