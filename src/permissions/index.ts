import { shield, allow } from 'graphql-shield'
import { rules } from './rules'

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    filterPosts: rules.isAuthenticatedUser,
    post: rules.isAuthenticatedUser,
    '*': allow,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    publish: rules.isPostOwner,
  },
  // Subscription: {
  //   latestPost: deny,
  // },
})
