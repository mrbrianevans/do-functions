import {validate} from "jsonschema";
import type {Schema} from "jsonschema";


interface ReturnValue {
  headers?: Record<string, string>,
  statusCode?: number,
  body: string
}


/**
 * Respond to a Function call (activation/invocation).
 * Validates input arguments according to the provided JSON Schema.
 * It runs the async logic function and returns the response as serialised JSON.
 * @param schema - JSON schema to validate input arguments. Should always be type: object
 * @param logic - the logic of the function execution.
 */
export const wrapFunction = (logic: (args: Record<string, any>) => any, schema: Schema & { type: 'object' }) => async (args: Record<string, any>): Promise<ReturnValue> => {
  let response: ReturnValue
  try {
    const valid = validate(args, schema)
    if (valid.valid) {
      const result = await logic(args)
      response = {headers: {'content-type': 'application/json'}, body: JSON.stringify(result), statusCode: 200}
    } else {
      response = {
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({msg: 'Bad request', errors: valid.errors.map(e => e.message)}),
        statusCode: 400
      }
    }
  } catch (e) {
    response = {headers: {'content-type': 'application/json'}, body: JSON.stringify({msg: e.message}), statusCode: 500}
  }
  return response
};
