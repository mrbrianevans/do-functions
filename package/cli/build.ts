// cli build script
/*
Build source files into one-file-per-Function for deployment, bundled with all dependencies etc.
 */
import {mkdir, readdir, writeFile} from 'fs/promises'
import {resolve} from 'node:path'
import {build} from 'esbuild'

const packagesSrcDir = resolve(process.argv[2] ?? './packages')
const packagesOutDir = resolve(process.argv[3] ?? './build')

await buildFunctions(packagesSrcDir, packagesOutDir)

async function buildFunctions(packagesSrcDir, outdir) {
  const startTime = performance.now()
  console.log('Source code directory: ', packagesSrcDir)
  console.log('Output directory: ', outdir)
  const packageOutDir = resolve(outdir, 'packages')
  const packages = await readdir(packagesSrcDir)
  console.log('Found', packages.length, packages.length === 1 ? 'package' : 'packages')
  const project = {packages: packages.map(p => ({name: p, functions: <{ name: string, runtime: string }[]>[]}))}
  for (const packageName of packages) {
    await mkdir(resolve(packageOutDir, packageName), {recursive: true})
    const functions = await readdir(resolve(packagesSrcDir, packageName))
    for (const functionName of functions) {
      console.time("Built " + packageName + '/' + functionName)
      const res = await build({
        bundle: true,
        outfile: resolve(packageOutDir, packageName, functionName + '.js'),
        entryPoints: [resolve(packagesSrcDir, packageName, functionName, 'index.ts')],
        format: 'cjs', platform: 'node', minify: true
      })
      console.timeEnd("Built " + packageName + '/' + functionName)
      project.packages.find(p => p.name === packageName)?.functions.push({name: functionName, runtime: 'nodejs:18'})
      res.warnings.forEach(console.log)
      res.errors.forEach(console.log)
    }
  }
  const duration = performance.now() - startTime
  console.log('Built in ', Math.round(duration), 'milliseconds')
  console.log('Run `doctl serverless deploy ' + outdir + '` to deploy')

  await writeFile(resolve(outdir, 'project.json'), JSON.stringify(project, null, 2))
}
