import {test} from 'node:test'
import {startServer} from "../server/startServer.js";

test('start dev server with sample project', async function (t) {

  const server = await startServer(new URL('../sampleProject', import.meta.url).pathname, 0) // random port for testing
  console.log('Server started')
  await t.test('send some requests to dev server', async function () {

    console.time('Request sample/hello')
    const res = await fetch(new URL('/sample/hello', server.address ?? 'http://localhost:62747'))
    console.timeEnd('Request sample/hello')
    const body = await res.json()
    console.log('Received response:', res.status, res.statusText, {body})

  })

  await server.close()
  console.log('Server closed')

})
