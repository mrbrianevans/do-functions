[GitHub](https://github.com/mrbrianevans/do-functions)
|
[do-functions NPM](https://www.npmjs.com/package/do-functions)
|
[do-functions-server NPM](https://www.npmjs.com/package/do-functions-server)

Easily develop and deploy serverless functions on Digital Ocean.

## Basic usage

```bash
npm i do-functions
```

```typescript
import {wrapFunction} from 'do-functions'

async function logic(args) {
  return 'Hello world'
}

export const main = wrapFunction(logic)
```

Run `do-functions {srcDir} {outDir}` to build functions for deployment.

Run `do-functions-server` to start a local development server which serves your functions as endpoints on localhost.

See the `/example` directory of the Git repository for a complete example.

See [getting started](./getting-started.md) for a guide to get started using this library to develop and deploy
Functions on Digital Ocean.

## Docs directory

- [getting started](./getting-started.md) (getting started guide to make your first function)
- [help with imports](./module.md) (ES module, Common JS and TypeScript import styles)
- [dev server](./test-server.md) (serve your functions locally before deploying)
- [throwing errors](./throwing-errors.md) (for setting the HTTP response code)
- [CLI options](./cli.md) (command line interface for building and bundling)
