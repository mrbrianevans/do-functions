import {wrapFunction} from 'do-functions'


async function logic(args) {
    console.log('Request with args:', args) // log request
    return 'Hello JavaScript'
}


export const main = wrapFunction(logic)
