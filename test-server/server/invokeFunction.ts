import {join} from "node:path";
import {firstExists} from "../cli/utils.js";
import {Worker} from 'worker_threads'

export async function invokeFunction({packagesDir, packageName, functionName, entrypoint = 'main', args, env}) {
  // check package/function.js, package/function/function.js and package/function/index.js
  const sourceName = await firstExists(join(packagesDir, packageName, functionName + '.js'), join(packagesDir, packageName, functionName, functionName + '.js'), join(packagesDir, packageName, functionName, 'index.js'))
  if (sourceName) {
    const worker = new Worker(`const {parentPort} = require('worker_threads');
    async function invoke(){
const { ${entrypoint} } = await import('file:///' + ${JSON.stringify(sourceName)}+ '?' + Date.now());
const output = await ${entrypoint}();
parentPort.postMessage(output);
}
invoke();
`, {eval: true, env, stderr: true, stdin: true, stdout: true, resourceLimits: {maxOldGenerationSizeMb: 256}})
    const output = await new Promise<any>((resolve, reject) => {
      worker.once('message', output => resolve(output))
      worker.once('error', output => reject(output))
    })
    return output
  } else throw new Error(`Function not found where package=${packageName} and function=${functionName}. Expected to find: ${join(packagesDir, packageName, functionName + '.js')}`)
}
