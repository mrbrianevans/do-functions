// a minimal function to test the dev server

export function main(args) {
    return {body: process.env.DO_FUNCTIONS_SERVER ?? '"Hello world"'}
}
