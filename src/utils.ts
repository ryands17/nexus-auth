import { verify } from 'jsonwebtoken'
import { Context } from './types'

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

    if (!verifiedToken.userId) throw new Error('cannot find user!')
    return verifiedToken.userId
  } else {
    throw new Error('cannot find user!')
  }
}
