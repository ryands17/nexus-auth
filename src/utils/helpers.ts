import { sign } from 'jsonwebtoken'
import { APP_SECRET, tokens } from './constants'

export const handleError = (error: any) => {
  // add any other logging mechanism here e.g. Sentry
  throw error
}

export const generateAccessToken = (userId: number) => {
  const accessToken = sign(
    {
      userId: userId.toString(),
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
