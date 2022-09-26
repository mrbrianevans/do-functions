

export interface ReturnValue {
  headers?: Record<string, string>,
  statusCode?: number,
  body: string
}


/**
 * Respond to a Function call (activation/invocation).
 * It runs the async logic function and returns the response as serialised JSON.
 * @param logic - the logic of the function execution.
 */
export const wrapFunction /* @__PURE__ */ = (logic: (args: Record<string, any>) => any) => async (args: Record<string, any>): Promise<ReturnValue> => {
  let response: ReturnValue
  try {
    const result = await logic(args)
    response = {headers: {'content-type': 'application/json'}, body: JSON.stringify(result), statusCode: 200}
  } catch (e) {
    response = {headers: {'content-type': 'application/json'}, body: JSON.stringify({msg: e.message}), statusCode: 500}
  }
  return response
};
