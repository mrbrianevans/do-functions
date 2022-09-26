interface ProjectYaml {
  packages: {
    name: string
    functions: {
      name: string,
      runtime: string
    }[]
  }[]
}


export function printProjectYaml(projectYaml: ProjectYaml) {
  for (const projectPackage of projectYaml.packages) {
    console.log('pkg', projectPackage.name)
    for (const packageFunction of projectPackage.functions) {
      console.log(`\t- ${projectPackage.name}/${packageFunction.name} [runtime=${packageFunction.runtime}]`)
    }
  }
}
