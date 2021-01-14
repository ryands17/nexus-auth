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
    createDraft(data: { title: $title, content: $content }) {
      title
      published
    }
  }
`

export const deleteDraft = /* GraphQL */ `
  mutation deleteDraft($id: Int!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`
