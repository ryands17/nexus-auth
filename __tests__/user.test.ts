import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

afterAll(async () => {
  await client.disconnect()
})

it('cannot create a user with an email address that is already in user', async () => {
  const data = {
    email: 'foo@bar.com',
    password: 'password',
  }
  const user = await client.user.create({
    data,
  })

  expect(user).toHaveProperty('email')
  expect(user.email).toEqual(data.email)

  expect(
    client.user.create({
      data: {
        email: 'foo@bar.com',
        password: 'password',
      },
    })
  ).rejects.toThrow()
})
