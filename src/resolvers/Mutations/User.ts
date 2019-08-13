import { mutationField } from 'nexus'
import { stringArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { APP_SECRET } from '../../utils'

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
    return {
      token: sign({ userId: user.id }, APP_SECRET),
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
  resolve: async (_, { email, password }, context) => {
    const user = await context.photon.users.findOne({
      where: {
        email,
      },
    })
    if (!user) {
      throw new Error('Invalid username or password')
    }
    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      throw new Error('Invalid username or password')
    }
    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user,
    }
  },
})
