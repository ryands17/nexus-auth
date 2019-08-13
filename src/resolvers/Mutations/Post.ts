import { idArg, stringArg, mutationField } from 'nexus'
import { getUserId } from '../../utils'

export const createDraft = mutationField('createDraft', {
  type: 'Post',
  args: {
    title: stringArg(),
    content: stringArg({ nullable: true }),
  },
  resolve: (_, { title, content }, ctx) => {
    const userId = getUserId(ctx)
    return ctx.photon.posts.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { id: userId } },
      },
    })
  },
})

export const deletePost = mutationField('deletePost', {
  type: 'Post',
  nullable: true,
  args: { id: idArg() },
  resolve: (_, { id }, ctx) => {
    return ctx.photon.posts.delete({
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
  resolve: (_, { id }, ctx) => {
    return ctx.photon.posts.update({
      where: { id },
      data: { published: true },
    })
  },
})
