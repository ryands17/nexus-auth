import { idArg, stringArg, mutationField } from '@nexus/schema'

export const createDraft = mutationField('createDraft', {
  type: 'Post',
  args: {
    title: stringArg(),
    content: stringArg({ nullable: true }),
  },
  resolve: async (_parent, { title, content }, ctx) => {
    const newPost = await ctx.prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { id: ctx.userId } },
      },
    })

    ctx.pubsub.publish('latestPost', newPost)
    return newPost
  },
})

export const deletePost = mutationField('deletePost', {
  type: 'Post',
  nullable: true,
  args: { id: idArg() },
  resolve: (_parent, { id }, ctx) => {
    return ctx.prisma.post.delete({
      where: {
        id,
      },
    })
  },
})

export const publish = mutationField('publish', {
  type: 'Post',
  nullable: true,
  args: { id: idArg() },
  resolve: (_parent, { id }, ctx) => {
    return ctx.prisma.post.update({
      where: { id },
      data: { published: true },
    })
  },
})
