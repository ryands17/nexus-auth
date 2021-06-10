import { objectType, unionType } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.boolean('published')
    t.nonNull.string('title')
    t.string('content')
    t.field('author', {
      type: 'User',
      resolve(root, _, ctx) {
        return ctx.prisma.post.findFirst({ where: { id: root.id } }).author()
      },
    })
  },
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.field('posts', {
      type: 'Post',
      resolve(root, _, ctx) {
        return ctx.prisma.user.findFirst({ where: { id: root.id } }).posts()
      },
    })
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('accessToken')
    t.field('user', { type: 'User' })
  },
})

export const InvalidUserError = objectType({
  name: 'InvalidUser',
  definition(t) {
    t.nonNull.string('message')
  },
})

export const UserAlreadyExistsError = objectType({
  name: 'UserAlreadyExists',
  definition(t) {
    t.nonNull.string('message')
  },
})

export const LoginResult = unionType({
  name: 'LoginResult',
  definition(t) {
    t.members('AuthPayload', 'InvalidUser')
  },
  resolveType(t) {
    // @ts-ignore
    return t.__typename
  },
})

export const SignupResult = unionType({
  name: 'SignupResult',
  definition(t) {
    t.members('AuthPayload', 'UserAlreadyExists')
  },
  resolveType(t) {
    // @ts-ignore
    return t.__typename
  },
})
