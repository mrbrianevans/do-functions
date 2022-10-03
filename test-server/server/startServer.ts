import {createServer} from "node:http";
import {requestHandler} from "./requestHandler.js";
import {join, isAbsolute} from "node:path";
import {readFile} from "fs/promises";
import {parse} from "yaml";
import {printProjectYml, ProjectYml} from "../projectYml/projectYml.js";

/**
 *
 * @param absBuiltDir - MUST be an absolute path
 * @param port - port to listen on. Default is 62747. Set to 0 for a random port.
 * @param projectYmlLocation - the file location of project.yml, which configures the functions.
 */
export async function startServer(absBuiltDir, port = 62747, {projectYmlLocation = 'project.yml'} = {}) {
  if (!isAbsolute(absBuiltDir)) throw new Error('Path to functions project must be absolute. Got ' + absBuiltDir)
  if (absBuiltDir.match(/^\\|\/[A-Z]:/)) absBuiltDir = absBuiltDir.slice(1) // remove leading slash on windows

  console.log('Serving packages from ', join(absBuiltDir, 'packages'))
  console.log('Looking for project config at', join(absBuiltDir, projectYmlLocation))
  const projectYml = <ProjectYml>await readFile(join(absBuiltDir, projectYmlLocation)).then(String).then(parse)
  printProjectYml(projectYml)
  console.log('in server.ts', projectYml.packages[0])
  const server = createServer(requestHandler(join(absBuiltDir, 'packages'), projectYml))
  await new Promise<void>(res => server.listen(port, res))
  const address = server.address()
  console.log('Server is listening', address === null || typeof address === 'string' ? address : ('http://localhost:' + address.port))

  return {
    close: () => new Promise(res => server.close(res)),
    address: address === null || typeof address === 'string' ? address : ('http://localhost:' + address.port)
  }
}
