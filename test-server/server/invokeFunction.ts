import {join} from "node:path";
import {firstExists} from "../cli/utils.js";

export async function invokeFunction({packagesDir, packageName, functionName, entrypoint = 'main', args, env}) {
  // check package/function.js, package/function/function.js and package/function/index.js
  const sourceName = await firstExists(join(packagesDir, packageName, functionName + '.js'), join(packagesDir, packageName, functionName, functionName + '.js'), join(packagesDir, packageName, functionName, 'index.js'))
  if (sourceName) {
    setEnv(env)
    // it would be preferable to run the function in a Worker thread, but can't figure out how to call the entrypoint function then.
    const functionModule = await import('file:///' + sourceName + '?' + Date.now())
    const entrypointFunction = functionModule[entrypoint]
    const output = entrypointFunction(args)
    resetEnv(env)
    return output
  } else throw new Error(`Function not found where package=${packageName} and function=${functionName}. Expected to find: ${join(packagesDir, packageName, functionName + '.js')}`)
}


function setEnv(env: Record<string, string>) {
  for (const [key, value] of Object.entries(env)) {
    console.log("Setting", key, value)
    process.env[key] = value
  }
}

function resetEnv(env: Record<string, string>) {
  for (const key of Object.keys(env)) {
    console.log("Deleting", key)
    // delete process.env[key]
  }
}
