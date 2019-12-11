import { rule } from 'graphql-shield'
import { getUserId } from '../utils/constants'
import { Context } from '../types'

export const rules = {
  isAuthenticatedUser: rule()((_parent, _args, ctx: Context) => {
    try {
      const userId = getUserId(ctx)
      return Boolean(userId)
    } catch (e) {
      return e
    }
  }),
  isPostOwner: rule()(async (_parent, { id }, ctx: Context) => {
    try {
      const userId = getUserId(ctx)
      const author = await ctx.photon.posts
        .findOne({
          where: {
            id,
          },
        })
        .author()
      return userId === author.id
    } catch (e) {
      return e
    }
  }),
}
