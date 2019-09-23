import { verify } from 'jsonwebtoken'
import { Context, Token } from '../types'
import { errors } from './errors'
import { handleError } from './helpers'

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '15m',
  },
  refresh: {
    name: 'REFRESH_TOKEN',
    expiry: '15d',
  },
}

export const isDev = process.env.NODE_ENV === 'development'

export const APP_SECRET = process.env.APP_SECRET

export const getUserId = (context: Context) => {
  const Authorization = context.request.get('Authorization')
  try {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token

    if (!verifiedToken.userId && verifiedToken.type !== tokens.access.name)
      handleError(errors.notAuthenticated)

    return verifiedToken.userId
  } catch (e) {
    handleError(errors.notAuthenticated)
  }
}
