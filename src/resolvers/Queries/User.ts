import { queryField } from '@nexus/schema'

export const me = queryField('me', {
  type: 'User',
  async resolve(_parent, _args, ctx) {
    const user = await ctx.prisma.user.findOne({
      where: {
        id: ctx.userId,
      },
    })
    return user
  },
})
