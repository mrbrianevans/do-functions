const {wrapFunction} = require('do-functions/schemaless')

async function logic(args) {
    console.log('Request with args:', args) // log request
    return 'Hello JavaScript'
}


export const main = wrapFunction(logic)
