import { shield, rule } from 'graphql-shield'
import { Context } from '../types'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        if (ctx.userId === -1) {
          return Error('Unauthenticated user!')
        }
        return true
      } catch (e) {
        return e
      }
    }
  ),
  isPostOwner: rule({ cache: 'contextual' })(
    async (_parent, args, ctx: Context) => {
      let id = args.where ? args.where.id : args.id
      try {
        const author = await ctx.prisma.post
          .findUnique({
            where: {
              id,
            },
          })
          .author()
        return ctx?.userId === author?.id
      } catch (e) {
        return e
      }
    }
  ),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    posts: rules.isAuthenticatedUser,
    post: rules.isAuthenticatedUser,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    publish: rules.isPostOwner,
  },
  Subscription: {
    latestPost: rules.isAuthenticatedUser,
  },
})
