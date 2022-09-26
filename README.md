# DO Functions

Easily develop and deploy serverless functions on Digital Ocean.

- Write source code in TypeScript
- Build before deploy (increases speed a lot!)
- Bundle dependencies 
- Always respond to invocations in the right format

## Overview
Digital Ocean Functions are a serverless solution for deploying small, self-contained functions. 
They offer support for JavaScript functions, but there are several shortcomings which this library aims to fix.
Firstly, deploys can take a long time if you have dependencies. 
Secondly, you can't specify any package manager (PNPM for example) so `pnpm-lock.yaml` will be ignored.
Thirdly, there are some errors which result in no logs, which makes them very difficult to debug.

This library solves some of these problems by performing a build before deploying the function. 
This could be on the developers machine for quick iteration of functions, or on a build server such as TravisCI or GitHub Actions.

The build is done using `esbuild` which bundles all dependencies into a single JS file which can be deployed as a function, making deploys really quick.
`esbuild` can build TypeScript, ES modules and CommonJS, giving you freedom to choose how you want to write code without affecting the build output.

By building before deploying, you get to choose which package manager you use, because the `package.json` is never deployed to Digital Ocean. Only a single JavaScript file is deployed.

## Additional goodies
On top of the main benefit of building before deploying, this library also offers various utils to make 
it easier to develop functions.

### Function logic wrapper
Wrap your function logic to avoid boilerplate in your source code. 
 - automatically serialise JSON responses and add `Content-Type` header.
 - validate input according to a JSON schema (optional) and reject bad requests
 - if the logic throws an error, respond with Status 500 Internal Server Error

### Custom Error
Based on FastifyError, you can throw this error in your logic and specify a status code to exit with.

For example, after checking the database if a resource doesn't exist you can throw an error with status 404.

This only works inside the function logic wrapper.

### Output `project.yaml`

Digital Ocean uses a `project.yaml` file to determine which functions to deploy.
You can write this yourself, or auto-generate it at build time based on your source code.

## CI

Continuous integration run on every push to test that there are no bugs.

[![build and test package](https://github.com/mrbrianevans/do-functions/actions/workflows/test.yaml/badge.svg)](https://github.com/mrbrianevans/do-functions/actions/workflows/test.yaml)
[![build example functions](https://github.com/mrbrianevans/do-functions/actions/workflows/example.yaml/badge.svg)](https://github.com/mrbrianevans/do-functions/actions/workflows/example.yaml)

Unit tests are run on exported functions and also the example (`/example`) is built using the CLI.

