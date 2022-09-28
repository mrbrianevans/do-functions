# Functions dev server

[Documentation](https://mrbrianevans.github.io/do-functions/test-server.html)
|
[do-functions-server NPM](https://www.npmjs.com/package/do-functions-server)

A server to test running your functions locally, before deploying.

```bash
npx do-functions-server .
```

Spins up a simple nodejs webserver that serves an endpoint for each function in a Digital Ocean Functions structured
project.

Serves endpoints on `http://localhost:62747` with URL paths `{packageName}/{functionName}`.

Expected structure:

```
packages/
    packageName/
        functionName.js
project.yml
```

> **Highly recommended to use in conjunction with [`do-functions`](https://www.npmjs.com/package/do-functions)**
> which produces the correct structure as build output.

See [getting-started#packages-structure](https://mrbrianevans.github.io/do-functions/getting-started.html#packages-structure)
for a guide to develop functions.

# Package script

You can add this script to your `package.json` to make it more convenient to test your functions:

```json
{
  "name": "your-package",
  "scripts": {
    "serve": "do-functions-server ."
  },
  "devDependencies": {
    "do-functions-server": "^1.0.1"
  }
}
```

Now you simply need to run `npm run serve` to start up a server of your functions.
