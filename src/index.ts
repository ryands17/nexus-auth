import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { Context } from './types'
import { permissions } from './permissions'
import { schema } from './schema'

const PORT = process.env.PORT || 4002

const prisma = new PrismaClient({
  log: ['query'],
})

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: ({ req, res }): Context => {
    return {
      req,
      res,
      prisma,
    }
  },
  playground: true,
  tracing: true,
  cors: true,
})

server.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
)

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
