import { server } from '../src/server'
import { prisma } from '../src/utils/helpers'
import { Headers } from 'cross-fetch'

// @ts-ignore
global.Headers = global.Headers || Headers

type Config = { url: string }

export const getConfig = () => {
  let config: any = {}

  beforeAll(async () => {
    const { url } = await server.listen({ port: 0 })
    config.url = url
    return config
  })

  afterAll(async () => {
    await server.stop()
    return prisma.$disconnect()
  })

  return config as Config
}
