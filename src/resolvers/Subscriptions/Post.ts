import { subscriptionField } from '@nexus/schema'

export const latestPosts = subscriptionField('latestPosts', {
  type: 'Post',
  list: true,
  subscribe(_root, _args, ctx) {
    return ctx.pubsub.asyncIterator('latestPosts')
  },
  resolve(payload) {
    return payload
  },
})
