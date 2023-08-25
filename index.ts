import { NodePath, Node } from "@babel/traverse";
import { default as traverse } from "@babel/traverse";
import {parse} from "@babel/parser"
import prettier from "prettier"
import fs from 'fs'

async function main() {
    try {
        const originalCode = fs.readFileSync("inputs/test.ts", {encoding:'utf-8'})
        const nodeList = generateNodes(originalCode)
        const lintedCodeObjects = await generateUpdatedNodes(nodeList,originalCode)
        generateUpdatedCode(lintedCodeObjects, originalCode)
    } catch (err) {
        console.log(err)
    }
}

function generateUpdatedCode(lintedCodeObjects: LintedCodeObject[], code:string){
    lintedCodeObjects.forEach((finalResultItem:LintedCodeObject)=>{
        code = code.replace(finalResultItem.oldCode, finalResultItem.lintedCode)
    })
    fs.writeFileSync("outputs/answer.ts", code)
}

interface CommentObject {
    type: string;
    value: string;
}

interface LintedCodeObject {
    oldCode: string;
    lintedCode: string;
    start: number; 
    end: number;
}

function isTemplateLiteral(tlObject: Node):Boolean {
    if (!tlObject.leadingComments) return false;
    return tlObject.leadingComments.some((nodeObject: CommentObject) => {
        if (nodeObject.type == "CommentBlock" && nodeObject.value == "tsx") return true;
    });
  }

function generateNodes(code:string):Node[] {
    const ast = parse(code, {
        sourceType: 'module',
        plugins:['jsx','typescript']
    });
    const traverseList = [] as Node[]
    traverse(ast, {
        TemplateLiteral(path: NodePath) {
            if (isTemplateLiteral(path.node)) traverseList.push(path.node);
        }
    });
    return traverseList    
}

async function generateUpdatedNodes(nodes:Node[], code:string):Promise<LintedCodeObject[]> {
    try {
        const unfulfilledNodePromises = nodes.map((node:Node) => {
            return new Promise<LintedCodeObject>(async (res,rej) => {
                if (node.start && node.end) {
                    const codeBlock = code.slice(node.start +1, node.end -1)
                    try {
                        const updatedCode = await lint(codeBlock)
                        res({
                            oldCode:codeBlock,
                            lintedCode:updatedCode,
                            start: node.start + 1,
                            end: node.end - 1
                        })
                    } catch (err) {
                        rej(err)
                    }
                } else rej("start and end doesn't exist.") 
            })
        });
        const finalList = await Promise.all(unfulfilledNodePromises)
        return finalList
    } catch (err) {
        throw err
    }
}

async function lint(code: string): Promise<string> {
    return new Promise<string>((res, rej) => {
        setTimeout(() => {
            const formattedCode = prettier.format(code, { parser: 'babel' });
            res(formattedCode);
        }, 5000);
    })
}

main()