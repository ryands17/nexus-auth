import { PrismaClient } from '@prisma/client'
import { ContextParameters } from 'graphql-yoga/dist/types'

export interface Context {
  prisma: PrismaClient
  request: ContextParameters['request']
  response: ContextParameters['response']
}

export interface Token {
  userId: string
  type: string
  timestamp: number
}
