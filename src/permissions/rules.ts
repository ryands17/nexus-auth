import { rule } from 'graphql-shield'
import { Context } from '../types'
import { handleError } from '../utils/helpers'
import { errors } from '../utils/errors'

export const rules = {
  isAuthenticatedUser: rule()((_parent, _args, ctx: Context) => {
    try {
      if (ctx.userId === -1) {
        return handleError(errors.notAuthenticated)
      }
      return true
    } catch (e) {
      return e
    }
  }),
  isPostOwner: rule()(async (_parent, { id }, ctx: Context) => {
    try {
      const author = await ctx.prisma.post
        .findOne({
          where: {
            id,
          },
        })
        .author()
      return ctx.userId === author.id
    } catch (e) {
      return e
    }
  }),
}
