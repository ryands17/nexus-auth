import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { Request, Response } from 'express'
import { IncomingMessage } from 'http'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  pubsub: PubSub
}

export interface SocketContext {
  prisma: PrismaClient
  req: IncomingMessage
  pubsub: PubSub
}

export interface Token {
  userId: string
  type: string
  timestamp: number
}
