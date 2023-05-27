// these need to be 2 separate functions so that ESbuild can only import the jsonschema module if it's used.

import {validate} from "jsonschema";
import type {Schema} from "jsonschema";

import {wrapFunction} from "./wrapper.js";
import type {ReturnValue} from "./wrapper.js";
import createError from '@fastify/error'

export type InputSchema = Schema & { type: 'object' } // allow consumers to use schema type for their schemas

// custom error which specifies the 400 status code if input doesn't validate against schema
const ValidationError = createError('VALIDATION_ERROR', 'Input is invalid on property path %s', 400)
/**
 * Respond to a Function call (activation/invocation).
 * Validates input arguments according to the provided JSON Schema.
 * It runs the async logic function and returns the response as serialised JSON.
 * @param schema - JSON schema to validate input arguments. Should always be type: object
 * @param logic - the logic of the function execution.
 */
export const wrapFunctionWithSchema = /* @__PURE__ */ (logic: (args: Record<string, any>) => any, schema: InputSchema) => async (args: Record<string, any>): Promise<ReturnValue> => {

  async function wrappedValidationLogic(innerArgs: Record<string, any>) {
    const valid = validate(innerArgs, schema)
    if (!innerArgs) {
      throw new ValidationError('$ (root)')
    } else if (valid.valid) {
      return await logic(innerArgs)
    } else {
      throw new ValidationError(valid.propertyPath)
    }
  }

  return await wrapFunction(wrappedValidationLogic)(args)
};
