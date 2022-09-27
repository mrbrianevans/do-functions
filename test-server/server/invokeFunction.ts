import {join} from "node:path";
import {fileExists} from "../cli/utils.js";

export async function invokeFunction({packagesDir, packageName, functionName, entrypoint = 'main', args}) {
  const sourceName = join(packagesDir, packageName, functionName + '.js') // unlike DO, assume the function has been bundled
  const exists = await fileExists(sourceName)
  if (exists) {
    const functionModule = await import('file:///' + sourceName)
    const entrypointFunction = functionModule[entrypoint]
    return entrypointFunction(args)
  } else throw new Error(`Function not found where package=${packageName} and function=${functionName}. Expected to find: ${sourceName}`)
}
