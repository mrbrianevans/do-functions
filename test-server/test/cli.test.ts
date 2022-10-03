import {exec} from 'node:child_process'
import {test} from 'node:test'
import {setTimeout} from 'node:timers/promises'
import * as assert from "node:assert";


await test('spawn cli in child process', async function (t) {

  await t.test('only positional command line arguments', async function () {
    const proc = exec('node ./cli/server.js ./sampleProject', {timeout: 5000})
    proc.stdout?.pipe(process.stdout)
    await setTimeout(250)

    const res = await fetch('http://localhost:62747/sample/hello')
    assert.equal(res.status, 200, 'Status code not 200 from test server')
    const output = await res.text()
    console.log({output})
    assert.equal(output, '"Hello world"', 'Response body not "Hello world"')
    proc.kill("SIGTERM")
    await setTimeout(250)
  })


  await t.test('pass default project yaml command line argument', async function () {
    const proc = exec('node ./cli/server.js ./sampleProject --project-yml project.yml', {timeout: 5000})
    proc.stdout?.pipe(process.stdout)
    await setTimeout(250)

    const res = await fetch('http://localhost:62747/sample/hello')
    assert.equal(res.status, 200, 'Status code not 200 from test server')
    const output = await res.text()
    console.log({output})
    assert.equal(output, '"Hello world"', 'Response body not "Hello world"')
    proc.kill("SIGTERM")
    await setTimeout(250)
  })

})

await test('load environment variables', async function (t) {
  await t.test('custom project yaml command line argument with env var set', async function () {
    // the alternate project.yml passes an environment variable that changes the output to "CustomProjectYamlUsed"
    // listen on a different port to avoid conflicts
    const proc = exec('node ./cli/server.js ./sampleProject --project-yml alternate-project.yml --port 6006', {timeout: 5000})
    proc.stdout?.pipe(process.stdout)
    await setTimeout(250)

    const res = await fetch('http://localhost:6006/sample/hello')
    assert.equal(res.status, 200, 'Status code not 200 from test server')
    const output = await res.text()
    console.log({output})
    assert.equal(output, '"CustomProjectYamlUsed"', 'Response body indicates environment vars not loaded')
    proc.kill("SIGTERM")
    await setTimeout(250)
  })
})

await test('listen on custom port', async function (t) {
  await t.test('custom project yaml command line argument', async function () {
    // the alternate project.yml passes an environment variable that changes the output to "CustomProjectYamlUsed"
    const proc = exec('node ./cli/server.js ./sampleProject --port 6008', {timeout: 5000})
    proc.stdout?.pipe(process.stdout)
    await setTimeout(250) // wait for startup
    const res = await fetch('http://localhost:6008/sample/hello')
    assert.equal(res.status, 200, 'Status code not 200 from test server')
    proc.kill("SIGTERM")
    await setTimeout(250) // wait for graceful shutdown
  })
})
