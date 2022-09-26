# DO Functions

Easily develop and deploy serverless functions on Digital Ocean.

Basic usage:

```typescript
import {wrapFunction} from 'do-functions'


async function logic(args) {
  return 'Hello world'
}

const schema = {type: 'object'}
export const main = wrapFunction(logic, schema)

```

and then run `do-functions {srcDir} {outDir}` to build for deployment.
