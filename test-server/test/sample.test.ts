import {test,} from 'node:test'
import {startServer} from "../server/startServer.js";
import * as assert from "assert";

test('start dev server with sample project', async function (t) {

  const server = await startServer(new URL('../sampleProject', import.meta.url).pathname, 0) // random port for testing
  console.log('Server started')
  await t.test('send some requests to dev server', async function () {

    console.time('Request sample/hello')
    const res = await fetch(new URL('/sample/hello', server.address ?? 'http://localhost:62747'))
    console.timeEnd('Request sample/hello')
    const body = await res.json()
    console.log('Received response:', res.status, res.statusText, {body})
    assert.equal(res.status, 200, 'Response code is not 200')

  })

  await t.test('send request arguments', async function () {
    const inputArguments = new URLSearchParams({name: 'test'})
    const res = await fetch(new URL('/sample/helloBody?' + inputArguments.toString(), server.address ?? 'http://localhost:62747'))
    assert.equal(res.status, 200, 'Response code is not 200')
  })

  await server.close()
  console.log('Server closed')

})

test('use a custom entrypoint', async function (t) {
  const server = await startServer(new URL('../sampleProject', import.meta.url).pathname, 0, {projectYmlLocation: 'alternate-entrypoint.yml'}) // random port for testing
  await t.test('send a request to dev server with alternate entrypoint', async function () {
    const res = await fetch(new URL('/sample/hello', server.address ?? 'http://localhost:62747'))
    const body = await res.json()
    console.log('Received response:', res.status, res.statusText, {body})
    assert.equal(body, 'Not main handler')
  })
  await server.close()
})
