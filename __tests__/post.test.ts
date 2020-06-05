import { request, GraphQLClient } from 'graphql-request'
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

const createUser = /* GraphQL */ `
  mutation createUser($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      accessToken
    }
  }
`

const createDraft = /* GraphQL */ `
  mutation createDraft($title: String!, $content: String!) {
    createDraft(title: $title, content: $content) {
      title
      published
    }
  }
`

let token = ''

test('authenticated user can create a post', async () => {
  const user = {
    name: 'user 1',
    email: 'u1@g.com',
    password: 'user 1',
  }
  const response: any = await request(URL, createUser, user)
  token = response.signup.accessToken

  const graphQLClient = new GraphQLClient(URL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  const post: any = await graphQLClient.request(createDraft, {
    title: 'Title',
    content: 'Content',
  })

  expect(post).toHaveProperty('createDraft')
  expect(post.createDraft.published).toBeFalsy()
})
