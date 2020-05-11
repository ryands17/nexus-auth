import { idArg, stringArg, mutationField } from '@nexus/schema'
import { getUserId } from '../../utils/constants'

export const createDraft = mutationField('createDraft', {
  type: 'Post',
  args: {
    title: stringArg(),
    content: stringArg({ nullable: true }),
  },
  resolve: async (_parent, { title, content }, ctx) => {
    const userId = getUserId(ctx)
    const newPost = await ctx.prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { id: userId } },
      },
    })

    const allPosts = await ctx.prisma.post.findMany({
      first: 10,
    })

    ctx.pubsub.publish('latestPosts', allPosts)

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
