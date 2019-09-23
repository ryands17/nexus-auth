import { config } from 'dotenv'
config()

import { nexusPrismaPlugin } from '@generated/nexus-prisma'
import Photon from '@generated/photon'
import { makeSchema } from 'nexus'
import { GraphQLServer } from 'graphql-yoga'
import * as path from 'path'
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
  types: [allTypes, nexusPrisma],
  outputs: {
    typegen: path.join(__dirname, '../generated/nexus-typegen.ts'),
    schema: path.join(__dirname, '/schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@generated/photon',
        alias: 'photon',
      },
      {
        source: path.join(__dirname, 'types.ts'),
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

server.express.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.cookies
    const { userId } = validateRefreshToken(refreshToken)
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
      // FIXME: In development only! for production, add a url or a regex for subdomains.
      origin: '*',
    },
  },
  () => console.log(`🚀 Server ready at http://localhost:${PORT}`)
)
