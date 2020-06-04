import { server } from '../src/server'
import { prisma } from '../src/utils/helpers'

beforeAll(async (done) => {
  await server.listen({ port: 8000 })
  console.log('server started!')
  done()
})

afterAll(async (done) => {
  await server.stop()
  await prisma.disconnect()
  done()
})
