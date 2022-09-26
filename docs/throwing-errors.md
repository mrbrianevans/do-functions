# Throwing errors

To send a specific status code when an error is thrown, you can
use [`@fastify/error`](https://www.npmjs.com/package/@fastify/error):
A small utility, used by Fastify itself, for generating consistent error objects across your codebase and plugins.

This package recognises these errors and uses the status code supplied as the HTTP response status code.

You need to install the [`@fastify/error`](https://www.npmjs.com/package/@fastify/error) package to use this feature.

This is used internally to return a 400 status code if the input doesn't validate against the JSON schema.

## Usage

```js
import createError from '@fastify/error'

const CustomError = createError('ERROR_CODE', 'message', 401)

async function logic() {
    throw new CustomError()
}
```

Example for resource not found:

```js
import createError from '@fastify/error'

const NotFoundError = createError('NOT_FOUND', 'Resource not found', 404)

async function logic() {
    const resource = get('resourceName')
    if (resource) return resource
    else throw new NotFoundError()
}
```
