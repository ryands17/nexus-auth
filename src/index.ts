import { config } from 'dotenv'
config()

import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from './permissions'
import { schema } from './schema'
import { isDev } from './utils/constants'
import { createContext } from './utils/helpers'

const PORT = process.env.PORT || 4002

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  playground: true,
  tracing: isDev(),
  debug: isDev(),
  cors: true,
  // subscriptions: {
  //   onConnect: (_connectionParams, _websocket, connContext): SocketContext => {
  //     return {
  //       req: connContext.request,
  //       prisma,
  //       pubsub,
  //     }
  //   },
  // },
})

server.listen({ port: PORT }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
