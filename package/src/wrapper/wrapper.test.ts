import test from 'node:test'
import assert from "assert";
import {ReturnValue, wrapFunction} from "./wrapper.js";

/*
Tests scenarios where
1. everything works as expected, status code is 200
2. the logic throws an error, status is 500
Test makes sure that there is an object returned with properties: body, headers and statusCode
 */

await test('test simple function wrapper without schema', async function (t) {

  await t.test('check for headers and body in response', async function () {
    const returnValue = {success: true}
    const main = wrapFunction(function () {
      return returnValue
    })

    const response = await main({})
    console.log('Returned ', response)
    validateResponse(response)
    assert.deepStrictEqual(JSON.parse(response.body), returnValue)
    assert.equal(response.statusCode, 200, 'Status code is not 200')
  })

  await t.test('check for headers and body in response when logic throws error', async function () {
    const main = wrapFunction(function () {
      throw new Error('Internal server error (simulated)')
    })

    const response = await main({}) // invoked without name
    console.log('Returned ', response)
    validateResponse(response)
    assert.equal(response.statusCode, 500, 'Status code is not 500 when logic throws')
  })
})

export function validateResponse(response: ReturnValue) {
  assert('body' in response && typeof response.body === 'string', 'Response does not have string body')
  assert.doesNotThrow(() => JSON.parse(response.body), SyntaxError, 'Response body could not be parsed')
  assert('headers' in response && response.headers, 'Response does not have headers set')
  assert('content-type' in response.headers, 'Response headers do not have content-type set')
  assert.equal(response.headers['content-type'], 'application/json', 'Content type in response headers is not JSON')
  assert.equal(typeof response.statusCode, 'number', 'Status code is not a number')
}
