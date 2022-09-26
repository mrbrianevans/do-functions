# Example usage

An example to show the basic usage of this package.

## Project structure

There is a single `package.json` for all the Functions in the project, stored at the root level.

Function source code is in this structure:

```
packages
    packageName
        functionName
            index.ts [required]
            anyOtherSrcs.ts
```

There is a `packages` directory, which contains subdirectories for each function "package".
Each package contains subdirectories for each "Function".
Each Function directory contains at minimum an `index.ts` file which exports a function called `main`.

## Language

You can write functions in either JavaScript or TypeScript. They all get compiled to JavaScript in the build step.

## Deploy

After running the `package.json` build script with something like `npm run build`, you can deploy to Digital Ocean (
after setting up the `doctl` command line tool for serverless) with this command:

```
doctl serverless deploy build
```
