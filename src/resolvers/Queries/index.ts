import * as User from './User'
import * as Post from './Post'
import { queryField } from 'nexus'

const info = queryField('info', {
  type: 'String',
  resolve: () => 'API is functional!',
})

export const Query = {
  info,
  ...User,
  ...Post,
}

// export const Query = queryType({
//   definition(t) {
//     t.field('me', {
//       type: 'User',
//       resolve: (_, __, ctx: Context) => {
//         const userId = getUserId(ctx)
//         return ctx.photon.users.findOne({
//           where: {
//             id: userId,
//           },
//         })
//       },
//     })

//     t.list.field('feed', {
//       type: 'Post',
//       resolve: (_, args, ctx) => {
//         return ctx.photon.posts.findMany({
//           where: { published: true },
//         })
//       },
//     })

//     t.list.field('filterPosts', {
//       type: 'Post',
//       args: {
//         searchString: stringArg({ nullable: true }),
//       },
//       resolve: (_, { searchString }, ctx) => {
//         getUserId(ctx)
//         return ctx.photon.posts.findMany({
//           where: {
//             OR: [
//               {
//                 title: {
//                   contains: searchString,
//                 },
//               },
//               {
//                 content: {
//                   contains: searchString,
//                 },
//               },
//             ],
//           },
//         })
//       },
//     })

//     t.field('post', {
//       type: 'Post',
//       nullable: true,
//       args: { id: idArg() },
//       resolve: (_, { id }, ctx) => {
//         return ctx.photon.posts.findOne({
//           where: {
//             id,
//           },
//         })
//       },
//     })
//   },
// })
