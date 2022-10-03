import type {IncomingMessage, ServerResponse} from 'node:http'
import {invokeFunction} from "./invokeFunction.js";
import type {ProjectYml} from "../projectYml/projectYml.js";

export const requestHandler = (packagesDir, projectYml: ProjectYml) => async (req: IncomingMessage, res: ServerResponse) => {
  console.log('in requestHandler.ts', projectYml.packages[0])
  console.log(new Date(), req.method, 'Request on ', req.url)
  if (req.method === 'GET' || req.method === 'HEAD') {
    const urlMatch = req.url?.match(/^\/([^\/?]+)\/([^\/?]+)\/?(\?.*)?$/)
    if (urlMatch) {
      const [, packageName, functionName, query] = urlMatch
      const args = Object.fromEntries(new URLSearchParams(query).entries())
      const projectYmlPackage = projectYml.packages.find(p => p.name === packageName)
      const projectYmlFunction = projectYmlPackage?.functions.find(f => f.name === functionName)
      if (projectYmlPackage && projectYmlFunction) {
        console.log({projectYmlPackage, projectYmlFunction})
        const env = Object.assign({}, projectYmlPackage.environment, projectYmlFunction.environment)
        console.log({env})
        const entrypoint = projectYmlFunction.entrypoint
        const result = await invokeFunction({packageName, functionName, packagesDir, args, env, entrypoint})
          .catch(e => ({
            headers: {'content-type': 'application/json'},
            statusCode: 500,
            body: `{"msg":"Internal server error: ${e.message}"}`
          }))
        res.writeHead(result.statusCode ?? 200, result.headers ?? {})
        res.end(result.body)
      } else {
        res.end(JSON.stringify({msg: 'Function not in project.yml config. Try restart.', functionName, packageName}))
      }
    } else {
      res.end(JSON.stringify({msg: 'URL is in wrong format. Try packageName/functionName'}))
    }
  } else {
    res.writeHead(405, {Allow: 'GET,HEAD', 'content-type': 'application/json'})
    res.end(JSON.stringify({msg: 'HTTP method not allowed. Try doing a GET request rather.'}))
  }
}
