import { config } from 'dotenv'
config()

import { nexusPrismaPlugin } from 'nexus-prisma'
import { Photon } from '@prisma/photon'
import { makeSchema } from 'nexus'
import { GraphQLServer } from 'graphql-yoga'
import { join } from 'path'
import * as allTypes from './resolvers'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { Context } from './types'
import { isDev } from './utils/constants'
import { permissions } from './permissions'
import { errors } from './utils/errors'
import { validateRefreshToken, generateAccessToken } from './utils/helpers'

const PORT = process.env.PORT || 4002

const photon = new Photon({
  debug: isDev,
})

const nexusPrisma = nexusPrismaPlugin({
  photon: (ctx: Context) => ctx.photon,
})

const schema = makeSchema({
  types: [allTypes],
  plugins: [nexusPrisma],
  outputs: {
    typegen: join(
      __dirname,
      '..',
      'node_modules/@types/nexus-typegen/index.d.ts'
    ),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/photon',
        alias: 'photon',
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
})

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: (request: any, response: any) => {
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
