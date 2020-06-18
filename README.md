# GraphQL Server with Authentication Prisma 2 and Nexus Schema

![Build Status](https://github.com/ryands17/nexus-auth/workflows/CI/badge.svg)

This example shows how to implement a **GraphQL server with an email-password-based auth**, based on [Prisma](https://www.prisma.io/), [apollo-server](https://www.apollographql.com/server/), [graphql-shield](https://github.com/maticzav/graphql-shield) & [Nexus Schema](https://www.nexusjs.org/#/components/schema/about) via the [Nexus Prisma](https://www.nexusjs.org/#/components/schema/plugins/prisma) plugin.

## How to use

### 1. Clone this repo & install dependencies

Install Node dependencies:

`yarn` (recommended) or `npm install`

### 2. Set up the database

This uses a simple [SQLite database](https://www.sqlite.org/index.html).

**_Note_**: You can delete the migrations folder to create your own new migrations

To set up your database, run:

```sh
yarn db:save
yarn db:migrate
```

You can now use the [SQLite Browser](https://sqlitebrowser.org/) to view and edit your data in the `./prisma/dev.db` file that was created when you ran `yarn db:migrate`.

### 3. Generate Prisma Client (type-safe database client)

Run the following command to generate [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/generating-prisma-client):

```sh
yarn generate:prisma
```

Now you can seed your database using the `seed` script from `package.json`:

```sh
yarn seed
```

### 4. Start the GraphQL server

Launch your GraphQL server with this command:

```sh
yarn dev
```

Navigate to [http://localhost:4002](http://localhost:4002) in your browser to explore the API of your GraphQL server in a [GraphQL Playground](https://github.com/prisma-labs/graphql-playground).

### 5. Using the GraphQL API

The schema that specifies the API operations of your GraphQL server is defined in [`./src/generated/schema.graphql`](./src/generated/schema.graphql). Below are a number of operations that you can send to the API using the GraphQL Playground.

Feel free to adjust any operation by adding or removing fields. The GraphQL Playground helps you with its auto-completion and query validation features.

#### Retrieve all published posts and their authors

```graphql
query {
  feed {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
  }
}
```

<Details><Summary><strong>See more API operations</strong></Summary>

#### Register a new user

You can send the following mutation in the Playground to sign up a new user and retrieve an authentication token for them:

```graphql
mutation {
  signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
    token
  }
}
```

#### Log in an existing user

This mutation will log in an existing user by requesting a new authentication token for them:

```graphql
mutation {
  login(email: "alice@prisma.io", password: "graphql") {
    token
  }
}
```

#### Check whether a user is currently logged in with the `me` query

For this query, you need to make sure a valid authentication token is sent along with the `Bearer`-prefix in the `Authorization` header of the request:

```json
{
  "Authorization": "Bearer __YOUR_TOKEN__"
}
```

With a real token, this looks similar to this:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanAydHJyczFmczE1MGEwM3kxaWl6c285IiwiaWF0IjoxNTQzNTA5NjY1fQ.Vx6ad6DuXA0FSQVyaIngOHYVzjKwbwq45flQslnqX04"
}
```

Inside the Playground, you can set HTTP headers in the bottom-left corner:

Once you've set the header, you can send the following query to check whether the token is valid:

```graphql
{
  me {
    id
    name
    email
  }
}
```

</Details>

### 6. Changing the GraphQL schema

To make changes to the GraphQL schema, you need to manipulate the files in the resolvers folder.

## Next steps

### Testing

Run `yarn test` or `npm run test` to run tests via Jest in the **tests** folder.

- Check out the [Prisma docs](https://www.prisma.io/docs/)
