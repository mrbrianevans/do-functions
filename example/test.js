import {test} from 'node:test'
import {startServer} from "do-functions-server";
import assert from "assert";

test('start dev server and make request to functions', async function (t) {

    const server = await startServer(new URL('./build', import.meta.url).pathname, 0) // random port for testing

    async function testEndpoint(path) {
        console.time('Request ' + path)
        const res = await fetch(new URL(path, server.address ?? 'http://localhost:62747'))
        console.timeEnd('Request ' + path)
        const body = await res.json()
        console.log('Received response:', res.status, res.statusText, {body})
        assert.equal(res.status, 200, "Status code is not 200")
    }

    await t.test('request sample/hello', async function () {
        await testEndpoint('/sample/hello')
    })
    await t.test('request sample/hellojs', async function () {
        await testEndpoint('/sample/helloJs')
    })
    await t.test('request sample/helloValidation', async function () {
        await testEndpoint('/sample/helloValidation?name=test')
    })

    await server.close()

})

