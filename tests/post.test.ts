import { request, GraphQLClient } from 'graphql-request'
import { createUser, createDraft } from './graphql'
import { getURL } from './helpers'

let token = ''

test('authenticated user can create a post', async () => {
  const URL = getURL()
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
