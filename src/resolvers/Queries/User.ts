import { queryField } from 'nexus'
import { getUserId } from '../../utils/constants'

export const me = queryField('me', {
  type: 'User',
  resolve(_parent, _args, ctx) {
    const userId = getUserId(ctx)
    return ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })
  },
})
