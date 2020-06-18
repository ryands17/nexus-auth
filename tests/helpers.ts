import { server } from '../src/server'
import { prisma } from '../src/utils/helpers'

let URL = ''

beforeAll(async (done) => {
  const { url } = await server.listen({ port: 0 })
  URL = url
  done()
})

afterAll(async (done) => {
  await server.stop()
  await prisma.disconnect()
  done()
})

export const getURL = () => {
  return URL
}
