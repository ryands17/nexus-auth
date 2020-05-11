import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { sign } from 'jsonwebtoken'
import { APP_SECRET, tokens } from './constants'
import { Context } from 'nexus-prisma/dist/utils'

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

const prisma = new PrismaClient({
  log: ['query'],
})
const pubsub = new PubSub()

export const createContext = (ctx: any): Context => {
  return {
    ...ctx,
    prisma,
    pubsub,
  }
}
