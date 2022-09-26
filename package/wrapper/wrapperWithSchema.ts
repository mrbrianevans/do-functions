// these need to be 2 separate functions so that ESbuild can only import the jsonschema module if it's used.

import {validate} from "jsonschema";
import type {Schema} from "jsonschema";

import {wrapFunction} from "./wrapper.js";
import type {ReturnValue} from "./wrapper.js";

export type InputSchema = Schema & { type: 'object' } // allow consumers to use schema type for their schemas

/**
 * Respond to a Function call (activation/invocation).
 * Validates input arguments according to the provided JSON Schema.
 * It runs the async logic function and returns the response as serialised JSON.
 * @param schema - JSON schema to validate input arguments. Should always be type: object
 * @param logic - the logic of the function execution.
 */
export const wrapFunctionWithSchema = /* @__PURE__ */ (logic: (args: Record<string, any>) => any, schema: InputSchema) => async (args: Record<string, any>): Promise<ReturnValue> => {
  const valid = validate(args, schema) // would be a problem if this function call throws an error
  let response: ReturnValue
  if (valid.valid) {
    response = await wrapFunction(logic)(args)
  } else {
    response = {
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({msg: 'Bad request', errors: valid.errors.map(e => e.message)}),
      statusCode: 400
    }
  }
  return response
};
