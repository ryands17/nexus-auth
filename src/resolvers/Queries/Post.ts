import { stringArg, idArg, queryField } from '@nexus/schema'

export const feed = queryField('feed', {
  type: 'Post',
  list: true,
  resolve: (_parent, _args, ctx) => {
    return ctx.prisma.post.findMany({
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
  resolve: (_parent, { searchString }, ctx) => {
    return ctx.prisma.post.findMany({
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
  resolve: (_parent, { id }, ctx) => {
    return ctx.prisma.post.findOne({
      where: {
        id,
      },
    })
  },
})
