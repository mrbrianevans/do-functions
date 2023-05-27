// a sample function that takes arguments and returns them in the body

export function main(args) {
    if (args) {
        return {headers: {"content-type": "application/json"}, body: JSON.stringify(args), statusCode: 200}
    } else {
        return {
            headers: {"content-type": "application/json"},
            body: JSON.stringify({msg: 'No input arguments provided'}),
            statusCode: 400
        }
    }
}

