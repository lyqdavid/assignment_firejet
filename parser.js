const {parse} = require("@babel/parser")

const code = "2 + (4*10) + 1/0; 1+2"

const ast = parse(code)

// console.log(Object.keys(ast))
console.log(ast)
// console.log(ast?.program?.body)