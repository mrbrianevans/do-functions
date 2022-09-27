import {test} from 'node:test'
import assert from "assert";
import {InputSchema, wrapFunctionWithSchema} from "./wrapperWithSchema.js";
import {validateResponse} from "./wrapper.test.js";

await test('test simple function wrapper with schema and valid input', async function (t) {
  await t.test('check for headers and body in response with no input schema properties', async function () {
    const returnValue = {success: true}
    const schema: InputSchema = {type: 'object'}

    function logic() {
      return returnValue
    }

    const main = wrapFunctionWithSchema(logic, schema)
    const response = await main({})
    console.log('Returned ', response)
    validateResponse(response)
    assert.deepStrictEqual(JSON.parse(response.body), returnValue)
    assert.equal(response.statusCode, 200, 'Status code is not 200')
  })

  await t.test('check for headers and body in response with input schema properties', async function () {
    const schema: InputSchema = {type: 'object', properties: {name: {type: 'string'}}, required: ['name']}

    function logic({name}) {
      return {lowerName: name.toLowerCase()}
    }

    const main = wrapFunctionWithSchema(logic, schema)
    const response = await main({name: 'DO_FUNCTIONS'})
    console.log('Returned ', response)
    validateResponse(response)
    assert.equal(response.statusCode, 200, 'Status code is not 200')
    assert.deepStrictEqual(JSON.parse(response.body), {lowerName: 'do_functions'})
  })


  await t.test('check for headers and body in response when logic throws error', async function () {
    const schema: InputSchema = {type: 'object', properties: {name: {type: 'string'}}, required: ['name']}

    function logic({name}) {
      throw new Error('Internal server error (for testing)')
    }

    const main = wrapFunctionWithSchema(logic, schema)
    const response = await main({name: 'DO_FUNCTIONS'})
    console.log('Returned ', response)
    validateResponse(response)
    assert.equal(response.statusCode, 500, 'Status code is not 500') // expect a 500 status code
  })

})


await test('test simple function wrapper with schema and invalid input', async function (t) {

  await t.test('check for headers and body in response when input doesn\'t match schema', async function () {
    const schema: InputSchema = {type: 'object', properties: {name: {type: 'string'}}, required: ['name']}

    function logic({name}) {
      return {lowerName: name.toLowerCase()}
    }

    const main = wrapFunctionWithSchema(logic, schema)
    const response = await main({}) // property is missing
    console.log('Returned ', response)
    validateResponse(response)
    assert.equal(response.statusCode, 400, 'Status code is not 400') // expect a 400 status code
  })

  await t.test('logic throws error but request is invalid', async function () {
    const schema: InputSchema = {type: 'object', properties: {name: {type: 'string'}}, required: ['name']}

    function logic({name}) {
      throw new Error('Internal server error (for testing)')
    }

    const main = wrapFunctionWithSchema(logic, schema)
    const response = await main({}) // property is missing
    console.log('Returned ', response)
    validateResponse(response)
    // expect a 400 status code, because logic should not be called if input is invalid
    assert.equal(response.statusCode, 400, 'Status code is not 400')
  })
})
