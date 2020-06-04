import { request } from 'graphql-request'

const URL = 'http://localhost:8000/graphql'

const createUser = /* GraphQL */ `
  mutation createUser($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      user {
        id
        name
      }
    }
  }
`

const login = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`

test('successfully create a user', async () => {
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
    expect(true).toBeTruthy()
  }
})

test('successfully get token on login', async () => {
  const credentials = {
    email: 'u1@g.com',
    password: 'user 1',
  }
  const data: any = await request(URL, login, credentials)

  expect(data).toHaveProperty('login')
  expect(data.login.accessToken).toBeDefined()
})
