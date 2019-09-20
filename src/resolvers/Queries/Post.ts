import { stringArg, idArg, queryField } from 'nexus'
import { getUserId } from '../../utils/constants'

export const feed = queryField('feed', {
  type: 'Post',
  list: true,
  resolve: (_, __, ctx) => {
    return ctx.photon.posts.findMany({
      where: { published: true },
    })
  },
})

export const filterPosts = queryField('filterPosts', {
  type: 'Post',
  list: true,
  args: {
    searchString: stringArg({ nullable: true }),
  },
  resolve: (_, { searchString }, ctx) => {
    getUserId(ctx)
    return ctx.photon.posts.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchString,
            },
          },
          {
            content: {
              contains: searchString,
            },
          },
        ],
      },
    })
  },
})

export const post = queryField('post', {
  type: 'Post',
  nullable: true,
  args: { id: idArg() },
  resolve: (_, { id }, ctx) => {
    return ctx.photon.posts.findOne({
      where: {
        id,
      },
    })
  },
})
