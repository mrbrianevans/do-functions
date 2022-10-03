export interface ProjectYml {
  packages: {
    name: string
    environment?: Record<string, string>
    functions: {
      name: string,
      environment?: Record<string, string>
      // custom entrypoint, default is main
      entrypoint?: string
      runtime: string
    }[]
  }[]
}


export function printProjectYml(projectYml: ProjectYml) {
  for (const projectPackage of projectYml.packages) {
    const envStr = projectPackage.environment ? Object.keys(projectPackage.environment).length + ' env vars' : ''
    console.log('pkg', projectPackage.name, `[${[envStr].filter(s => s).join(', ')}]`)
    for (const packageFunction of projectPackage.functions) {
      const runtimeStr = packageFunction.runtime ? `runtime=${packageFunction.runtime}` : ''
      const entrypointStr = packageFunction.entrypoint ? 'entrypoint=' + packageFunction.entrypoint : ''
      const envStr = packageFunction.environment ? Object.keys(packageFunction.environment).length + ' env vars' : ''
      console.log(`\t- ${projectPackage.name}/${packageFunction.name} [${[runtimeStr, entrypointStr, envStr].filter(s => s).join(', ')}]`)
    }
  }
}
