import { sign, verify } from 'jsonwebtoken'
import { APP_SECRET, tokens } from './constants'
import { Token } from '../types'
import { errors } from './errors'

export const generateAccessToken = (userId: string) => {
  const accessToken = sign(
    {
      userId,
      type: tokens.access.name,
      timestamp: Date.now(),
    },
    APP_SECRET,
    {
      expiresIn: tokens.access.expiry,
    }
  )
  return accessToken
}

export const generateRefreshToken = (userId: string) => {
  const refreshToken = sign(
    {
      userId,
      type: tokens.refresh.name,
      timestamp: Date.now(),
    },
    APP_SECRET,
    {
      expiresIn: tokens.refresh.expiry,
    }
  )
  return refreshToken
}

export const validateRefreshToken = (token: string) => {
  try {
    const verifiedToken = verify(token, APP_SECRET) as Token
    if (!verifiedToken && verifiedToken.type !== tokens.refresh.name) {
      handleError(errors.notAuthenticated)
    }
    return verifiedToken.userId
  } catch (e) {
    handleError(errors.notAuthenticated)
  }
}

export const handleError = (error: string) => {
  // add any other logging mechanism here e.g. Sentry
  throw new Error(error)
}
