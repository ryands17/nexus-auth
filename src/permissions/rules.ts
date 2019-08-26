import { rule } from 'graphql-shield'
import { getUserId } from '../utils'
import { Context } from '../types'

export const rules = {
  isAuthenticatedUser: rule()((_, __, context: Context) => {
    try {
      const userId = getUserId(context)
      return Boolean(userId)
    } catch (e) {
      return e
    }
  }),
  isPostOwner: rule()(async (_, { id }, context: Context) => {
    try {
      const userId = getUserId(context)
      const author = await context.photon.posts
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
