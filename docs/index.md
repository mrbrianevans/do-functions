# DO Functions

Easily develop and deploy serverless functions on Digital Ocean.

Basic usage:

```typescript
import { wrapFunction } from 'do-functions'


async function logic(args) {
  return 'Hello world'
}

const schema = {type: 'object'}
export const main = wrapFunction(logic, schema)

```

and then run `do-functions {srcDir} {outDir}` to build for deployment.

See the `/example` directory of the Git repository for a complete example.

See [getting started](./getting-started.md) for a guide to get started using this library to develop and deploy
Functions on Digital Ocean.

## Links

- [throwing errors](./throwing-errors.md) (for setting the HTTP response code)
- [getting started](./getting-started.md) (getting started guide to make your first function)
- [dev server](./test-server.md) (serve your functions locally before deploying)
- [help with imports](./module.md) (ES module, Common JS and TypeScript import styles)
