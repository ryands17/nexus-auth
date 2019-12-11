import { queryField } from 'nexus'
import { getUserId } from '../../utils/constants'

export const me = queryField('me', {
  type: 'User',
  resolve(_parent, _args, ctx) {
    const userId = getUserId(ctx)
    return ctx.photon.users.findOne({
      where: {
        id: userId,
      },
    })
  },
})

export const fetchUsers = queryField('users', {
  type: 'User',
  list: true,
  resolve(_parent, _args, ctx) {
    return ctx.photon.users()
  },
})
