import {createServer} from "node:http";
import {requestHandler} from "./requestHandler.js";
import {join, isAbsolute} from "node:path";
import {readFile} from "fs/promises";
import {parse} from "yaml";
import {printProjectYaml} from "../projectYaml/projectYaml.js";

/**
 *
 * @param absBuiltDir - MUST be an absolute path
 * @param port - port to listen on. Default is 62747. Set to 0 for a random port.
 */
export async function startServer(absBuiltDir, port = 62747) {
  if (!isAbsolute(absBuiltDir)) throw new Error('Path to functions project must be absolute. Got ' + absBuiltDir)
  if (absBuiltDir.match(/^\\|\/[A-Z]:/)) absBuiltDir = absBuiltDir.slice(1) // remove leading slash on windows
  const server = createServer(requestHandler(join(absBuiltDir, 'packages')))
  server.on('listening', () => console.log('server listening on localhost'))
  server.on('error', (e) => console.error('Error on server: ', e))
  await new Promise<void>(res => server.listen(port, res))

  const address = server.address()
  console.log('Server is listening', address === null || typeof address === 'string' ? address : ('http://localhost:' + address.port))
  console.log('Serving packages from ', join(absBuiltDir, 'packages'))
  console.log('Looking for project config at', join(absBuiltDir, 'project.yml'))
  const projectYaml = await readFile(join(absBuiltDir, 'project.yml')).then(String).then(parse)
  printProjectYaml(projectYaml)


  return {
    close: () => new Promise(res => server.close(res)),
    address: address === null || typeof address === 'string' ? address : ('http://localhost:' + address.port)
  }
}
