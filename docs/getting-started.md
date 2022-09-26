# Getting started

A guide to getting started developing and deploying Digital Ocean serverless Functions for the NodeJS runtime.

## Example

This guide goes step-by-step setting up a new project to deploy as serverless functions.
If you want to see a complete example, see the `example` directory in the Git repository.

## Setup environment

To follow this guide, you will need the following dependencies installed on your computer:

- [nodejs](https://nodejs.org/en/)
- [npm](https://docs.npmjs.com/cli/v6/configuring-npm/install)/[pnpm](https://pnpm.io/) (any node package manager)
- [doctl](https://github.com/digitalocean/doctl/releases/latest) (Digital Ocean command line tool)

This guide was made using `node@v18.7.0`, `pnpm@v7.11.0` and `doctl@v1.81.0`.

The Digital Ocean command line tool `doctl` needs to install support for serverless functions separately,
and can be done with the
command [`doctl serverless install`](https://docs.digitalocean.com/reference/doctl/reference/serverless/install/).

I've used PNPM, but put `npm` in the example commands because its more familiar to most JS developers.
You can replace all mentions of `npm` with `pnpm` and everything will work the same, except a bit faster.

## Create new project/directory

Create a new project, or add a directory to an existing project if using a monorepo.

Once you've created a new directory (`mkdir`), make a `package.json` file and a `packages` directory in the top level of
your project directory. Set `"type": "module"` in your `package.json` to enable ES modules.

## Install `do-functions` library

Inside your project directory, run `npm install do-functions` to install this library.

For convenience, add a build script to the `package.json` like this:

```json
{
  "scripts": {
    "build": "do-functions"
  }
}
```

Running that script will bundle your functions ready for deployment.

## Packages structure

Inside the `packages` directory, you can add subdirectories for each package (group of functions), and then within each
package directory a subdirectory for each function.
Each function directory must contain an `index.ts` or `index.js` file which exports a function called `main`.
This is the main entrypoint to your function which will be called upon invocation.

To clarify, every project should follow this structure:

```
packages/
    packageName/
        functionName/
            index.{ts,js} [required]
package.json
```

This guide will make a project called `timeAndDate`, with a package called `date` and a function called `getToday`.
Wherever these occur, replace with your own names.

The structure for the above described function will look like this:

```
packages/
    date/
        getToday/
            index.ts
package.json
```

Create directories for each package and function you want to deploy

## Writing function logic

In your functions `index.ts` file, you can have something like this, implementing your own logic in the logic function:

```js
import {wrapFunction} from 'do-functions'

async function logic(args) {
    return {date: new Date().toISOString().split('T')[0]}
}

export const main = wrapFunction(logic)
```

## Building

Now build your function to get it ready for deployment.
This will use the build script we added to `package.json` earlier.

Run `npm run build` in your project root.

You will notice a new directory called `build` created.
This contains the bundled function code that can be deployed to Digital Ocean.

It should look something like this:

```
packages/
    date/
        getToday.js
project.yaml
```

Each function has been compiled to a single JavaScript file containing all the logic and dependencies.
The `project.yaml` file describes your project structure for Digital Ocean to know what to deploy.

## Deploying

After building your functions, you can deploy them with this command of the Digital Ocean command line tool in the root
of your project:

```bash
doctl serverless deploy build
```

`build` has been provided as the last argument because the directory is called `build` that contains the built
functions.

Before you can deploy for the first time, you will have to create and connect to a functions namespace on Digital Ocean,
which you can do by following
https://docs.digitalocean.com/products/functions/quickstart/#create-a-namespace.

Your function should be deployed and publicly accessible now!

If you've struggled to follow this guide, or if any step was not explained clearly or you've found a mistake,
please [open an issue on GitHub](https://github.com/mrbrianevans/do-functions/issues/new/choose) and I will try to
improve the guide.
Or even better, if you can see how it should be improved, you can open
a [pull request](https://github.com/mrbrianevans/do-functions/pulls).
