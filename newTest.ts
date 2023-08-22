export const DEFAULT_REACT_FILES: SandpackBundlerFiles = {
    "/App.jsx": {
        code: /*tsx*/` import "./styles.css"
        export default function App() {
        return (
        <div className="flex gap-2 w-[300px] h-[400px] bg-slate-500 p-4">
        <p>This text is big Hmm</p>
        <div className="bg-blue-400 w-8 h-8" /> <div className="bg-red-400 w-8 h-8" /> <div className="bg-green-400 w-8 h-8" />
        </div> )
        }
        `,
    },
    [FIREJET_SAVE_DATA_PATH]: {
        //TODO: When filenames are the same it may throw errors 
        code: JSON.stringify(saveFile), //dfdf
    }
}
const myTypescriptString = /*tsx*/`console.log(${myText})`;
const newString = `console.log('doggie')`;
let a = {"a":3}