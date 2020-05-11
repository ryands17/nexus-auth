import { verify } from 'jsonwebtoken'
import { Context, Token } from '../types'
import { errors } from './errors'
import { handleError } from './helpers'

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '1d',
  },
}

export const APP_SECRET = process.env.APP_SECRET

export const getUserId = (ctx: Context) => {
  const Authorization = ctx.req.get('Authorization')
  try {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token

    if (!verifiedToken.userId && verifiedToken.type !== tokens.access.name)
      handleError(errors.notAuthenticated)

    return parseInt(verifiedToken.userId)
  } catch (e) {
    handleError(errors.notAuthenticated)
  }
}
