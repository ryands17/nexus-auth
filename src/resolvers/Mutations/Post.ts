import { intArg, extendType, nonNull, stringArg } from 'nexus'

export const post = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      args: { title: nonNull(stringArg()), content: stringArg() },
      resolve(_parent, args, ctx) {
        const data = {
          ...args,
          author: { connect: { id: ctx.userId } },
        }
        return ctx.prisma.post.create({ data })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.post.delete({ where: { id: args.id } })
      },
    })

    t.nullable.field('publish', {
      type: 'Post',
      args: { id: intArg() },
      async resolve(_parent, { id }, ctx) {
        const newPost = await ctx.prisma.post.update({
          where: { id },
          data: { published: true },
        })

        ctx.pubsub.publish('latestPost', newPost)
        return newPost
      },
    })
  },
})
