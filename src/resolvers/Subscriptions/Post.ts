import { subscriptionField } from 'nexus'
import { Prisma } from '@prisma/client'

export const latestPost = subscriptionField('latestPost', {
  type: 'Post',
  subscribe(_root, _args, ctx) {
    return ctx.pubsub.asyncIterator('latestPost')
  },
  resolve(payload) {
    return payload as Prisma.PostGetPayload<{}>
  },
})
