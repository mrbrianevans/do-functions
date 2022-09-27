# DO Functions

Easily develop and deploy serverless functions on Digital Ocean.

- Write source code in TypeScript
- Build before deploy (increases speed a lot!)
- Bundle dependencies
- Always respond to invocations in the right format
- Serve your functions on a local development server

## Basic usage

This is a minimal example of all thats required in your function source code to get started.

```js
import {wrapFunction} from 'do-functions'

export const main = wrapFunction(args => 'Hello from JavaScript')
```

Simply wrap your logic in `wrapFunction` and export the result as a named export called `main`, and you're good to go.

See the doc for [a more in depth guide](https://mrbrianevans.github.io/do-functions/getting-started.html).

## Overview

Digital Ocean Functions are a serverless solution for deploying small, self-contained functions.
They offer support for JavaScript functions, but there are several shortcomings which this library aims to fix.
Firstly, deploys can take a long time if you have dependencies.
Secondly, you can't specify any package manager (PNPM for example) so `pnpm-lock.yaml` will be ignored.
Thirdly, there are some errors which result in no logs, which makes them very difficult to debug.

This library solves some of these problems by performing a build before deploying the function.
This could be on the developers machine for quick iteration of functions, or on a build server such as TravisCI or
GitHub Actions.

The build is done using `esbuild` which bundles all dependencies into a single JS file which can be deployed as a
function, making deploys really quick.
`esbuild` can build TypeScript, ES modules and CommonJS, giving you freedom to choose how you want to write code without
affecting the build output.

By building before deploying, you get to choose which package manager you use, because the `package.json` is never
deployed to Digital Ocean. Only a single JavaScript file is deployed.

## Features

These are the main exports/features available:

### Function logic wrapper

```js
import { wrapFunction } from 'do-functions'
export const main = wrapFunction(args => 'Hello '+args.name)
```

Wrap your function logic to avoid boilerplate in your source code.

- automatically serialise JSON responses and add `Content-Type` header.
- if the logic throws an error, respond with Status 500 Internal Server Error

### Input validation

```js
import { wrapFunctionWithSchema } from 'do-functions'
const schema = {type:'object', properties: {name: {type:'string'}}, required: ['name']}
export const main = wrapFunctionWithSchema(args => 'Hello '+args.name, schema)
```

- auto-validate input according to a JSON schema and reject bad requests
- logic only gets called if input is valid

### Custom Errors

```js
import { wrapFunction } from 'do-functions'
import {createError} from '@fastify/error' // requires separate install
const CustomError = createError('NAME_NOT_INCLUDED', 'Name was not included in the request', 400)
export const main = wrapFunction(args => {
    if(!args.name) throw new CustomError()
    else return 'Hello '+args.name
})
```

You can throw a FastifyError in your logic and specify a status code to exit with. See the docs for more details.

For example, after checking the database if a resource doesn't exist you can throw an error with status 404.

### Build CLI

```bash
npx do-functions ./myproject ./myproject-dist
```

Bundle all your function source code and dependencies into a single file for each function.
Makes deploys much faster and less error prone.
Auto-generates `project.yml` at build time based on your source code structure.

### Test server CLI

```bash
npx do-functions-server ./myproject
```

Spin up a local dev server to test your functions before deploying.

It will serve your functions on a localhost port. You can test them with `curl`.

## CI

Continuous integration run on every push to test that there are no bugs.

[![build and test package](https://github.com/mrbrianevans/do-functions/actions/workflows/test.yaml/badge.svg)](https://github.com/mrbrianevans/do-functions/actions/workflows/test.yaml)
[![build example functions](https://github.com/mrbrianevans/do-functions/actions/workflows/example.yaml/badge.svg)](https://github.com/mrbrianevans/do-functions/actions/workflows/example.yaml)

Unit tests are run on exported functions and also the example (`/example`) is built using the CLI.

After building the example functions, a development server is setup and requests are made to each function,
the status code is checked to be 200 and then the server is shutdown. This is a complete end-to-end test.

You can also use the development server to setup a test CI workflow for your functions.
Look in `.github/workflows/example.yaml` to see how it's done.
