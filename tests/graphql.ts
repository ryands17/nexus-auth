export const createUser = /* GraphQL */ `
  mutation createUser($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      accessToken
      user {
        id
        name
      }
    }
  }
`

export const login = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
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
