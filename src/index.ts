import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { ApolloServer, PubSub } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { Context, SocketContext } from './types'
import { permissions } from './permissions'
import { schema } from './schema'
import { isDev } from './utils/constants'

const PORT = process.env.PORT || 4002

const prisma = new PrismaClient({
  log: ['query'],
})
const pubsub = new PubSub()

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: (ctx): Context => {
    return {
      ...ctx,
      prisma,
      pubsub,
    }
  },
  playground: true,
  tracing: isDev(),
  debug: isDev(),
  cors: true,
  subscriptions: {
    onConnect: (_connectionParams, _websocket, connContext): SocketContext => {
      return {
        req: connContext.request,
        prisma,
        pubsub,
      }
    },
  },
})

server.listen({ port: PORT }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})

// const server = new GraphQLServer({
//   schema,
//   middlewares: [permissions],
//   context: (request: any): Context => {
//     return {
//       ...request,
//       prisma,
//     }
//   },
// })
