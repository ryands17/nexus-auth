import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { GraphQLServer } from 'graphql-yoga'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { Context } from './types'
import { isDev } from './utils/constants'
import { permissions } from './permissions'
import { errors } from './utils/errors'
import { validateRefreshToken, generateAccessToken } from './utils/helpers'
import { schema } from './schema'

const PORT = process.env.PORT || 4002

const photon = new PrismaClient({
  debug: isDev(),
})

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: (request: any, response: any): Context => {
    return {
      ...request,
      ...response,
      photon,
    }
  },
})

server.express.use(helmet())
server.express.use(cookieParser())

server.express.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    const userId = validateRefreshToken(refreshToken)
    const accessToken = generateAccessToken(userId)
    res.json({
      data: {
        accessToken,
      },
    })
  } catch (e) {
    res.status(401).json({
      message: errors.notAuthenticated,
    })
  }
})

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
