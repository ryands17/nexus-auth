import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { GraphQLServer } from 'graphql-yoga'
import * as helmet from 'helmet'
import { Context } from './types'
import { permissions } from './permissions'
import { schema } from './schema'

const PORT = process.env.PORT || 4002

const prisma = new PrismaClient({
  log: ['query'],
})

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: (request: any): Context => {
    return {
      ...request,
      prisma,
    }
  },
})

server.express.use(helmet())

server.start(
  {
    port: PORT,
    cors: {
      credentials: true,
      // origin: process.env.CLIENT_ORIGIN,
      origin: '*',
    },
  },
  () => console.log(`🚀 Server ready at http://localhost:${PORT}`)
)
