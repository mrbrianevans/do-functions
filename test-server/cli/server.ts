/*
A test server to serve functions as endpoints on a localhost port.

A way to test your bundled functions after the build step, and ensure that status codes etc are correct.

I've tried to match what I think Digital Oceans server does, without actually seeing their source code so there could be some discrepancies.
 */


import {resolve} from "node:path";
import {startServer} from "../server/startServer.js";

const builtDir = resolve(process.argv[2] ?? './build')

const server = await startServer(builtDir)

// graceful shutdown
async function shutdown() {
  await server.close()
  process.exit()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
