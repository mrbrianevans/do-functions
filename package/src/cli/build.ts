#!/usr/bin/env node
// cli build script
/*
Build source files into one-file-per-Function for deployment, bundled with all dependencies etc.
 */
import {mkdir, readdir, writeFile, readFile, copyFile, rm} from 'fs/promises'
import {resolve} from 'node:path'
import {build, analyzeMetafile} from 'esbuild'
import {stringify as YAMLStringify, parse as YAMLParse} from 'yaml'
import {firstExists, fileExists} from './utils.js'
import {parseArgs} from "node:util";
import {rollup} from "rollup";
import typescriptPlugin from '@rollup/plugin-typescript';
import nodeResolvePlugin from "@rollup/plugin-node-resolve";
import commonjsPlugin from '@rollup/plugin-commonjs';
import terserPlugin from '@rollup/plugin-terser';


const commandLineOptions = {
  srcDir: {type: 'string'},
  outDir: {type: 'string'},
  'project-yml': {type: 'string'},
  'env': {type: 'string'},
  bundler: {type: 'string'}
} as const

const args = parseArgs({options: commandLineOptions, allowPositionals: true})

const bundler: 'esbuild' | 'rollup' = args.values.bundler === 'esbuild' || args.values.bundler === 'rollup' ? args.values.bundler : 'esbuild'
const packagesSrcDir = resolve(args.values.srcDir ?? args.positionals[0] ?? './packages')
const packagesOutDir = resolve(args.values.outDir ?? args.positionals[1] ?? './build')
const srcProjectYmlLocation = resolve(args.values["project-yml"] ?? (packagesSrcDir + '/../project.yml'))
const srcEnvFileLocation = resolve(args.values["env"] ?? (packagesSrcDir + '/../.env'))
//todo: take custom esbuild options as an optional parameter, or read them from a custom field in project.yml?
await buildFunctions(packagesSrcDir, packagesOutDir, srcProjectYmlLocation, srcEnvFileLocation)

async function buildFunctions(packagesSrcDir, outdir, srcProjectYml: string, envFile) {
  const startTime = performance.now()
  console.log('Source code directory: ', packagesSrcDir)
  console.log('Output directory: ', outdir)
  console.log('Looking for pre existing project.yml file at', srcProjectYml)
  console.log('Looking for .env file at', envFile)
  await rm(outdir, {force: true, recursive: true})
  await mkdir(outdir)
  const packageOutDir = resolve(outdir, 'packages')
  const packages = await readdir(packagesSrcDir)
  console.log('Found', packages.length, packages.length === 1 ? 'package' : 'packages', 'in source directory')
  const projectYmlAlreadyExists = await fileExists(srcProjectYml)
  if (projectYmlAlreadyExists) {
    console.log('Found pre existing project.yml file, using it as a starting point')
  }
  const envFileAlreadyExists = await fileExists(envFile)
  if (envFileAlreadyExists) {
    console.log('Found .env file, copying it to build directory')
    await copyFile(envFile, resolve(outdir, '.env'))
  }
  const project = projectYmlAlreadyExists ? YAMLParse(await readFile(srcProjectYml).then(String)) : {
    packages: packages.map(p => ({
      name: p,
      functions: <{ name: string, runtime: string }[]>[]
    }))
  }
  for (const packageName of packages) {
    if (!project.packages.find(p => p.name === packageName))
      project.packages.push({name: packageName, functions: []})
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
      if (bundler === "esbuild") {
        const res = await build({
          bundle: true,
          outfile: resolve(packageOutDir, packageName, functionName + '.js'),
          entryPoints: [indexFile],
          format: 'cjs', platform: 'node', minify: true, treeShaking: true, keepNames: true, metafile: true
        })
        res.warnings.forEach(console.log)
        res.errors.forEach(console.log)
        console.log(await analyzeMetafile(res.metafile, {color: true}).then(m => m.split('\n').slice(1, 4).join('\n')), '\n')
      } else if (bundler === "rollup") {
        const bundle = await rollup({
          input: indexFile,
          plugins: [typescriptPlugin({sourceMap: false}), nodeResolvePlugin({exportConditions: ['node']}), commonjsPlugin(), terserPlugin()],
        })
        await bundle.write({
          file: resolve(packageOutDir, packageName, functionName + '.js'),
          sourcemap: false, format: 'cjs'
        })
      }

      console.timeEnd("Built " + packageName + '/' + functionName)
      // todo: check if the built file is larger than 1MB and warn the user that a deploy won't be easy, likely to cause problems
      if (!project.packages.find(p => p.name === packageName)?.functions.find(f => f.name === functionName))
        project.packages.find(p => p.name === packageName)?.functions.push({name: functionName, runtime: 'nodejs:18'})
    }
  }
  const duration = performance.now() - startTime
  console.log('Built in ', Math.round(duration), 'milliseconds')
  console.log('Run `doctl serverless deploy ' + outdir + '` to deploy')

  await writeFile(resolve(outdir, 'project.yml'), YAMLStringify(project))

// package json required to specify that the built files are commonJS to allow them to be imported for testing by ES modules such as do-functions-server.
  const builtPackageJson = {
    "name": "build",
    "description": "Build output of bundled functions for Digital Ocean",
    "type": "commonjs",
    "scripts": {
      "start": "npx do-functions-server ."
    }
  }

  await writeFile(resolve(outdir, 'package.json'), JSON.stringify(builtPackageJson, null, 2))
}
