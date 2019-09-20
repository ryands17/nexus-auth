import { verify } from 'jsonwebtoken'
import { Context } from '../types'
import { errors } from '../errors'
import { handleError } from './helpers'

export const isDev = process.env.NODE_ENV === 'development'

export const APP_SECRET = process.env.APP_SECRET

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token

    if (!verifiedToken.userId) handleError(errors.notAuthenticated)
    return verifiedToken.userId
  } else {
    handleError(errors.notAuthenticated)
  }
}
