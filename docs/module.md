# How to import this package

## TL;DR

If you don't want to get into all the NodeJS module details, you can simply follow these opinionated recommendations
to have an easy development experience:

1. put `"type": "module"` in your `package.json`
1. put `"moduleResolution": "node16"` in your `tsconfig.json` (if using TypeScript)
1. import all functions like this `import { ... } from 'do-functions'` (not optimised)

If you would like to see a working example of these recommendations, look in the `/example` directory
of this package's GitHub repository which follows the first 2 recommendations, but also shows how to optimise imports.

Please read on if you would like more details about the various options for importing this package.

## CommonJS

If your `package.json` has `"type": "commonjs"` or doesn't have the `type` field at all, then you should use
the `require` function to import this package.

```js
const {wrapFunction} = require('do-functions')

export const main = wrapFunction(args => 'Hello from CommonJS')
```

## ES Module

If your `package.json` has `"type": "module"`, then you should use the `import` keyword to import this package.

```js
import {wrapFunction} from 'do-functions'

export const main = wrapFunction(args => 'Hello from an ES Module')
```

## TypeScript

If using TypeScript, you can set the `moduleResolution` field in your `tsconfig.json`.

It is highly recommended to set this field to `node16`.
Doing so will enable you to import from `do-functions/schema` and `do-functions/schemaless` and get the
correct types.

Setting this field doesn't change the function code that gets deployed to Digital Ocean, but it will
help you in development to avoid TypeScript errors on your imports.

## Import paths

This package exports multiple paths that you can import from.
This helps with tree shaking, to remove unused code and make your functions more lightweight.

All the examples up to here on this page have been importing from `do-functions`. This will always work,
but has a big downside that if you are not making use of the schema input validation, it will still include
the `jsonschema` library in your function code, adding about 30kb to every deployment.

To avoid bundling `jsonschema` if you aren't using validation, you can instead import from `do-functions/schemaless`:

```js
import {wrapFunction} from 'do-functions/schemaless'

export const main = wrapFunction(args => 'Hello from a lightweight function')
```

This will result in a tiny function to deploy (&lt; 1Kb).

You can also import schema'd functions explicitly from `do-functions/schema`.

This works in ES modules and CommonJS.

## Not working?

If you are struggling with importing this package, getting node errors, esbuild errors or TypeScript errors due to
this package, then please open an issue on the GitHub repository so someone can help you.

I've tried to get
it working as smoothly as possible to avoid headaches for users, but the module system is changing often
and it's highly possible that bugs will appear over time as TypeScript/Node/esbuild versions change.
