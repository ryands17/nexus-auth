import { makeSchema } from 'nexus'
import { join } from 'path'
import * as allTypes from './resolvers'

export const schema = makeSchema({
  types: [allTypes],
  outputs: {
    typegen: join(__dirname, 'generated', 'index.d.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql'),
  },
  contextType: {
    module: join(__dirname, 'types.ts'),
    export: 'Context',
    alias: 'ctx',
  },
  sourceTypes: {
    modules: [
      {
        module: require.resolve('.prisma/client/index.d.ts'),
        alias: 'prisma',
      },
    ],
  },
  prettierConfig: join(process.cwd(), 'package.json'),
})
