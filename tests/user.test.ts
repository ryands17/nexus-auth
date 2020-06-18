import { request } from 'graphql-request'
import { createUser, login } from './graphql'
import { getURL } from './helpers'

test('successfully create a user', async () => {
  const URL = getURL()
  try {
    const user = {
      name: 'user 1',
      email: 'u1@g.com',
      password: 'user 1',
    }
    const data: any = await request(URL, createUser, user)

    expect(data).toHaveProperty('signup')
    expect(data.signup.user.name).toEqual(user.name)
  } catch (e) {
    console.log('error', e)
  }
})

test('successfully get token on login', async () => {
  const URL = getURL()
  const credentials = {
    email: 'u1@g.com',
    password: 'user 1',
  }
  const data: any = await request(URL, login, credentials)

  expect(data).toHaveProperty('login')
  expect(data.login.accessToken).toBeDefined()
})
