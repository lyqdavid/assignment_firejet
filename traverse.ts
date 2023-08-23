import { NodePath, Node } from "@babel/traverse";

interface nodeObject {
  type?: string;
  value?: string;
  start?: number;
  end?: number;
}

interface thirdPromiseObject {
    listOfCode: Node[];
    code:string;
}

interface finalResultItem {
    newCode: string;
    lintedCode:string;
    start:number;
    end:number
}

interface finalResultObject {
    finalResult: finalResultItem[];
    code:string
}

const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");

const fs = require('fs');

const firstPromise = new Promise<string>((resolve)=>{
    fs.readFile('test.ts', 'utf-8', (err: TypeError, data: string) => {
        if (err) throw err;
        resolve(data)
    })
    // const code =
    //   "const myTypescriptString = /*tsx*/`console.log('abc');let x=4;`;const newString = `console.log('doggie')`";
    // resolve(code)
})

async function lint(code: string): Promise<string> {
    console.log("lint started")
    // const toPrint = prettier.format(code,{parser: "babel" });
    const toPrint = prettier.format(code);
    return toPrint;
}

function checkingTemplateLiteral(tlObject: Node) : boolean{
  if (!tlObject.leadingComments) return false;
  return tlObject.leadingComments.some((nodeObject: nodeObject) => {
    if (nodeObject.type == "CommentBlock" && nodeObject.value == "tsx")
      return true;
  });
}


function secondPromise(code: string) {
    return new Promise<thirdPromiseObject> ((resolve) => {
    const ast = parse(code, {
        sourceType: 'module',
        plugins:['jsx','typescript']
    });    
    let traverseList = [] as Node[];
    traverse(ast, {
        TemplateLiteral(path: NodePath) {
            if (checkingTemplateLiteral(path.node)) traverseList.push(path.node);
        },
    });
    resolve({listOfCode:traverseList, code:code});
    });
}

// function thirdPromise(thirdPromiseObject:thirdPromiseObject): Promise<string[]> {
//     // console.log("thirdPromise entered")
//     // console.log("thirdPromiseObject is", thirdPromiseObject)
//     const listOfCode = thirdPromiseObject.listOfCode
//     let code = thirdPromiseObject.code
//     // console.log("listOfCode is", listOfCode)
//     return new Promise<string[]>((resolve, reject) => {
//         let finalList = [] as string[];
//         listOfCode.forEach(async (eachCode: Node) => {
//             //   console.log("eachCode is", eachCode);
//             if (eachCode.start && eachCode.end) {
//                 const newCode = code.slice(eachCode.start+1, eachCode.end-1);
//                 const lintedCode = await lint(newCode);
//                 finalList.push(lintedCode);
//                 code = code.slice(0, eachCode.start+1) + lintedCode + code.slice(eachCode.end-1) 
//                 // console.log("newCode is", newCode)
//                 // console.log("lintedCode is", lintedCode)
//             } else reject("start and end doesn't exist");
//             // lint(newCode).then((code:any)=>{finalList.push(code)});
//         });
//         // console.log("final list", finalList);
//         resolve(finalList);
//         // resolve(code)
//     });
// }

// function printSolution(statement: string[]) {
//     statement.forEach((code)=>{
//         console.log("-------------------code is", code)
//     })
// }

function thirdPromise(thirdPromiseObject:thirdPromiseObject): Promise<finalResultObject> {
    const listOfCode = thirdPromiseObject.listOfCode
    const code = thirdPromiseObject.code
    return new Promise<finalResultObject>((resolve, reject) => {
        let finalList = [] as finalResultItem[];
        listOfCode.forEach(async (eachCode: Node) => {
            //   console.log("eachCode is", eachCode);
            if (eachCode.start && eachCode.end) {
                const newCode = code.slice(eachCode.start+1, eachCode.end-1);
                const lintedCode = await lint(newCode);
                finalList.push({
                    newCode:newCode,
                    lintedCode:lintedCode, 
                    start:eachCode.start+1, 
                    end:eachCode.end-1
                });
            } else reject("start and end doesn't exist");
            resolve({finalResult:finalList,code:code})
        });
    });
}

function printSolution(statement: finalResultObject) {
    let code = statement.code
    statement.finalResult.forEach(lintedCodeObject => {
        code = code.replace(lintedCodeObject.newCode,lintedCodeObject.lintedCode)
    })
    console.log(code)
}

firstPromise
    .then(secondPromise)
    .then(thirdPromise)
    .then(printSolution)
    .catch((err) => {
        console.log(err);
    });
