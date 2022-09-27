/*
A test server to serve functions as endpoints on a localhost port.

A way to test your bundled functions after the build step, and ensure that status codes etc are correct.

I've tried to match what I think Digital Oceans server does, without actually seeing their source code so there could be some discrepancies.
 */


import {createServer} from 'node:http'
import {resolve, join} from "node:path";
import {readFile} from "fs/promises";
import {parse} from "yaml";
import {fileExists} from "./utils.js";
import {printProjectYaml} from '../projectYaml/projectYaml.js';

const builtDir = resolve(process.argv[2] ?? './build')

const server = createServer(async (req, res) => {
  console.log(new Date(), req.method, 'Request on ', req.url)
  if (req.method === 'GET' || req.method === 'HEAD') {
    const urlMatch = req.url?.match(/^\/([^\/?]+)\/([^\/?]+)\/?(\?.*)?$/)
    if (urlMatch) {
      const [, packageName, functionName, query] = urlMatch
      const args = Object.fromEntries(new URLSearchParams(query).entries())
      const result = await callFunction({packageName, functionName, packagesDir: builtDir, args})
        .catch(e => ({
          headers: {'content-type': 'application/json'},
          statusCode: 500,
          body: `{"msg":"Internal server error: ${e.message}"}`
        }))
      res.writeHead(result.statusCode, result.headers)
      res.end(result.body)
    } else {
      res.end(JSON.stringify({msg: 'URL is in wrong format. Try packageName/functionName'}))
    }
  } else {
    res.writeHead(405, {Allow: 'GET,HEAD', 'content-type': 'application/json'})
    res.end(JSON.stringify({msg: 'HTTP method not allowed. Try doing a GET request rather.'}))
  }
})

server.listen(62747, async () => {
  const address = server.address()
  console.log('Server is listening', address === null || typeof address === 'string' ? address : ('http://localhost:' + address.port))
  console.log('Serving packages from ', join(builtDir, 'packages'))
  console.log('Looking for project config at', join(builtDir, 'project.yml'))
  const projectYaml = await readFile(join(builtDir, 'project.yml')).then(String).then(parse)
  printProjectYaml(projectYaml)
})


async function callFunction({packagesDir, packageName, functionName, entrypoint = 'main', args}) {
  const sourceName = join(packagesDir, 'packages', packageName, functionName + '.js') // unlike DO, assume the function has been bundled
  const exists = await fileExists(sourceName)
  if (exists) {
    const functionModule = await import('file:///' + sourceName)
    const entrypointFunction = functionModule[entrypoint]
    return entrypointFunction(args)
  } else throw new Error(`Function not found where package=${packageName} and function=${functionName}. Expected to find: ${sourceName}`)
}

// graceful shutdown
async function shutdown() {
  await new Promise(res => server.close(res))
  process.exit()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
