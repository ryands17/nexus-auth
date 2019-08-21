export class NotAuthenticated extends Error {
  constructor() {
    super('Unauthenticated user!')
  }
}
