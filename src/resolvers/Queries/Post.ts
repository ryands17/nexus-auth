import { extendType, intArg, nonNull } from 'nexus'

export const post = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('posts', {
      type: 'Post',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.post.findMany()
      },
    })

    t.field('post', {
      type: 'Post',
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.post.findFirst({ where: { id: args.id } })
      },
    })
  },
})
