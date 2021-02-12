import { request, GraphQLClient } from 'graphql-request'
import { createUser, createDraft, deletePost } from './graphql'
import { getConfig } from './helpers'

let token = ''

const config = getConfig()

test('authenticated user can create a post', async () => {
  const user = {
    name: 'user 1',
    email: 'u1@g.com',
    password: 'user 1',
  }
  const response: any = await request(config.url, createUser, user)
  token = response.signup.accessToken

  const graphQLClient = new GraphQLClient(config.url, {
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

test('same authenticated user can delete a post', async () => {
  const graphQLClient = new GraphQLClient(config.url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  const post: any = await graphQLClient.request(deletePost, {
    id: 1,
  })

  expect(post).toBeDefined()
})
