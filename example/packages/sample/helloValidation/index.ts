import {wrapFunctionWithSchema} from 'do-functions/schema'
import type {InputSchema} from 'do-functions'

// because the schema specifies that "name" is required, any request that doesn't contain it will be rejected
// before the logic function is called, and a status 400 Bad request will be sent.

const inputSchema: InputSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'}
  },
  required: ['name']
}

async function logic(args: { name: string }) {
  console.log('Request with name:', args.name) // log request
  return `Hello ${args.name}`
}


export const main = wrapFunctionWithSchema(logic, inputSchema)
