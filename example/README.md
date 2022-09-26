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
