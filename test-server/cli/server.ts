/*
A test server to serve functions as endpoints on a localhost port.

A way to test your bundled functions after the build step, and ensure that status codes etc are correct.

I've tried to match what I think Digital Oceans server does, without actually seeing their source code so there could be some discrepancies.
 */

import {parseArgs} from 'node:util';
import {resolve} from "node:path";
import {startServer} from "../server/startServer.js";


const commandLineOptions = {
  builtDir: {type: 'string'},
  'project-yml': {
    type: 'string'
  },
  port: {type: 'string'}
} as const

const args = parseArgs({options: commandLineOptions, allowPositionals: true})

console.log(args)

const builtDir = resolve(args.values.builtDir ?? args.positionals[0] ?? './build')
const projectYmlLocation = args.values["project-yml"] ?? 'project.yml'
const port = args.values.port ? parseInt(args.values.port) : undefined

const server = await startServer(builtDir, port, {projectYmlLocation})

// graceful shutdown
async function shutdown() {
  await server.close()
  process.exit()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
