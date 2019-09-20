import { queryField } from 'nexus'
import { getUserId } from '../../utils/constants'

export const me = queryField('me', {
  type: 'User',
  resolve: (_, __, ctx) => {
    const userId = getUserId(ctx)
    return ctx.photon.users.findOne({
      where: {
        id: userId,
      },
    })
  },
})
