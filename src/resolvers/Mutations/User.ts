import { mutationField, stringArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import {
  generateAccessToken,
  generateRefreshToken,
  handleError,
} from '../../utils/helpers'
import { errors } from '../../utils/errors'

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

    const [accessToken, refreshToken] = [
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    ]
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
    let user = null
    try {
      user = await ctx.photon.users.findOne({
        where: {
          email,
        },
      })
    } catch (e) {
      handleError(errors.invalidUser)
    }

    if (!user) handleError(errors.invalidUser)

    const passwordValid = await compare(password, user.password)
    if (!passwordValid) handleError(errors.invalidUser)

    const [accessToken, refreshToken] = [
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    ]
    ctx.response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    return {
      accessToken,
      user,
    }
  },
})
