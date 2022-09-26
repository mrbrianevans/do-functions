# Functions dev server

A server to test running your functions locally, before deploying.

Spins up a simple node webserver that serves an endpoint for each function in a Digital Ocean Functions structured
project.
See [getting-started#packages-structure](./getting-started.md#packages-structure) for the expected structure.

Serves endpoints on `http://localhost:62747` with URL paths `{packageName}/{functionName}`.

You could test a function in the example directory with this cURL command:

```bash
curl http://localhost:62747/sample/hellojs
```
