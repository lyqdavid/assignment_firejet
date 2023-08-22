const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");

const code = "const myTypescriptString = /*tsx*/`console.log(${myText})`;const newString = `console.log('doggie')`"

async function lint(code) { 
    // console.log("lint started")
    const toPrint =  prettier.format(code);
    return toPrint
}

function checkingTemplateLiteral(tlObject) {
    if (!tlObject.leadingComments) return false 
    return tlObject.leadingComments.some((nodeObject) => {
        // console.log("nodeObject is", nodeObject)
        if (nodeObject.type=="CommentBlock" && nodeObject.value == "tsx") return true
    })
}

const ast = parse(code)

let traverseList = []

/**
 * - get a list of template literals we are interested in
 *     - if condition of leadingComments met, i push to list
 */
const firstPromise = new Promise((resolve) => {
    traverse(ast, {
        TemplateLiteral(path) {
            // console.log("----------path is", path.node)
            if (checkingTemplateLiteral(path.node)) traverseList.push(path.node);
        }
    })
    resolve(traverseList)
})

function secondPromise(listOfCode) {
    return new Promise((resolve)=>{
        let finalList = []
        listOfCode.forEach(async (eachCode)=>{
            // console.log("eachCode is", eachCode)
            const newCode = code.slice(eachCode.start, eachCode.end)
            finalList.push(await lint(newCode))
        })
        resolve(finalList)
    })
}

function printSolution(statement) {
    console.log("statement is", statement)
}

firstPromise.then(secondPromise).then(printSolution)
// console.log("finalList is", finalList)