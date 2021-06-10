export const createUser = /* GraphQL */ `
  mutation createUser($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      ... on UserAlreadyExists {
        message
      }
      ... on AuthPayload {
        accessToken
        user {
          id
          name
        }
      }
    }
  }
`

export const login = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on InvalidUser {
        message
      }
      ... on AuthPayload {
        accessToken
      }
    }
  }
`

export const createDraft = /* GraphQL */ `
  mutation createDraft($title: String!, $content: String!) {
    createDraft(title: $title, content: $content) {
      title
      published
    }
  }
`

export const deletePost = /* GraphQL */ `
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`
