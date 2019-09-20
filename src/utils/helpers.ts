import { sign } from 'jsonwebtoken'
import { APP_SECRET } from './constants'

type Tokens = {
  accessToken: string
  refreshToken: string
}

export const createTokens = (userId: string): Tokens => {
  const accessToken = sign(
    {
      userId,
      type: 'ACCESS_TOKEN',
      timestamp: Date.now(),
    },
    APP_SECRET
  )

  const refreshToken = sign(
    {
      userId,
      type: 'REFRESH_TOKEN',
      timestamp: Date.now(),
    },
    APP_SECRET
  )

  return { accessToken, refreshToken }
}

export const handleError = (error: string) => {
  // add any other logging mechanism here e.g. Sentry
  throw new Error(error)
}
