// cli build script
/*
Build source files into one-file-per-Function for deployment, bundled with all dependencies etc.
 */
import {mkdir, readdir, stat, writeFile} from 'fs/promises'
import {resolve} from 'node:path'
import {build} from 'esbuild'
import {stringify as YAMLStringify} from 'yaml'

const packagesSrcDir = resolve(process.argv[2] ?? './packages')
const packagesOutDir = resolve(process.argv[3] ?? './build')

await buildFunctions(packagesSrcDir, packagesOutDir)

export async function buildFunctions(packagesSrcDir, outdir) {
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
      const indexFile = await firstExists(
        resolve(packagesSrcDir, packageName, functionName, 'index.ts'),
        resolve(packagesSrcDir, packageName, functionName, 'index.js'),
        resolve(packagesSrcDir, packageName, functionName + '.ts'),
        resolve(packagesSrcDir, packageName, functionName + '.js'))
      if (!indexFile) {
        console.log('Skipping', packageName + '/' + functionName, 'because index file not found. Try creating', packageName + '/' + functionName + '/index.js')
        continue
      }
      const res = await build({
        bundle: true,
        outfile: resolve(packageOutDir, packageName, functionName + '.js'),
        entryPoints: [indexFile],
        format: 'cjs', platform: 'node', minify: true, treeShaking: true
      })
      console.timeEnd("Built " + packageName + '/' + functionName)
      // todo: check if the built file is larger than 1MB and warn the user that a deploy won't be easy, likely to cause problems
      project.packages.find(p => p.name === packageName)?.functions.push({name: functionName, runtime: 'nodejs:18'})
      res.warnings.forEach(console.log)
      res.errors.forEach(console.log)
    }
  }
  const duration = performance.now() - startTime
  console.log('Built in ', Math.round(duration), 'milliseconds')
  console.log('Run `doctl serverless deploy ' + outdir + '` to deploy')

  await writeFile(resolve(outdir, 'project.yaml'), YAMLStringify(project))
}

// boolean of whether a file exists or not
async function fileExists(filename: string) {
  const s = await stat(filename).catch(e => null)
  return s?.isFile()
}

// returns the first file path which exists
async function firstExists(...filePaths: string[]) {
  for (const file of filePaths) if (await fileExists(file)) return file
}
