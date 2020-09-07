import { intArg, extendType } from '@nexus/schema'

export const post = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOnePost({
      alias: 'createDraft',
    })

    t.crud.deleteOnePost({ alias: 'deletePost' })

    t.field('publish', {
      type: 'Post',
      nullable: true,
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
