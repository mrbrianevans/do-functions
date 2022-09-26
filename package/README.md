# DO Functions

A wrapper and CLI to help you develop and deploy serverless functions on [Digital Ocean](https://www.digitalocean.com/).

## What's included

### Build CLI

Bundle your function source code BEFORE deploying to make deploys much faster and less error-prone.

Uses [`esbuild`](https://esbuild.github.io/) to bundle all your source code into a single JavaScript file for each
function, with dependencies inline.

See [getting-started#packages-structure](https://mrbrianevans.github.io/do-functions/getting-started.html#packages-structure)
for how to structure your functions., and then run `npm exec do-functions` in your project root to build!

Then you can quickly deploy
with [`doctl serverless deploy`](https://docs.digitalocean.com/reference/doctl/reference/serverless/deploy/).

### Function logic wrapper

Focus writing your actual function logic and leave the boilerplate to this libary.

Simply write functions like this:

```ts
import {wrapFunction} from 'do-functions'

async function logic(args) {
  return 'Hello from TypeScript'
}

export const main = wrapFunction(logic)
```

Will return an object like this (when main is called by invocation):

```json
{
  "body": "\"Hello from TypeScript\"",
  "headers": {
    "content-type": "application/json"
  },
  "statusCode": 200
}
```

<details>
<summary>or use built-in JSON Schema validation</summary>

Because the schema specifies that "name" is required, any request that doesn't contain it will be rejected
before the logic function is called, and a status `400 Bad request` will be sent.

```ts
// note: import from do-functions/schema to use validation
import {wrapFunctionWithSchema} from 'do-functions/schema'
import type {InputSchema} from 'do-functions/schema'


const inputSchema: InputSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'}
  },
  required: ['name']
}

async function logic(args: { name: string }) {
  console.log('Request with name:', args.name) // log request
  return `Hello ${args.name}`
}

export const main = wrapFunctionWithSchema(logic, inputSchema)
```

</details>

## Sign up to Digital Ocean and get $100 free

If you do not already have a Digital Ocean account, and you would like to use Functions, please
consider using my referral link to sign up by clicking the badge below:

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=4d6af2b60752&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

How it works: if you use this link, you will get $100 of credit on Digital Ocean to spend in your first 60 days.
If you spend more than $25, I will get $25 of credit as well.

**Note:** this project is not in any way affiliated with/supported by Digital Ocean. I'm just a regular
Digital Ocean user who started using Functions and realised there must be a better way, so I created this
to help, and made it available to others.
