import parseFile from "./utils/parseFile"
import { promises as fs } from "fs"
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import flagHandler from './argUtil/flags'
import cmdHandler from './argUtil/cmd'

const parsedFiles: any[]= [];
const helpMessage = [
    "cmd 1 - does this",
    "cmd 2 - does that"
]

async function parser(){
const allFiles: string[] = await getAllFiles("")
for(const planner of allFiles){
    const file = await parseFile(planner)
    parsedFiles.push(file)
}
parsedFiles.sort((a, b) => a.date.localeCompare(b.date))
}

async function getAllFiles(filePath: string){
    let arr: string[] = []
    const path: string = "./plannerDir/"+filePath
    const files = await fs.readdir(path) 
    for(const file of files){
        const stat = await fs.stat(path+"/"+file)
        if(stat.isDirectory()){
            const tempArr = await getAllFiles(filePath+"/"+file)
            arr.push(...tempArr)
        } else{
            arr.push(filePath + "/"+file)
        }
    }
    return arr
}

async function Main (){

    await parser()
    //console.log(parsedFiles)
    const rl = createInterface({ input, output})
    
    while(true){
        console.log("Enter an argument, or 'sa help' for list of commands")
        const res = await rl.question("> ")
        let arg = res.split(" ").slice(1)
        arg = arg.filter(val => val!=='')
        arg.forEach(val => val.toLowerCase)
        const cmd = arg[0]

        if(cmd === "help"){
            for(const line of helpMessage){
                console.log(line)
            }
            continue;
        }

        if(cmd === "term"){
            break;
        }

        let extra = 0
        let taskStr = ""
        if(cmd === "task"){
            for(let i = 1; i<arg.length; i++){
                if(arg[i].length>2 && arg[i].slice(0,2)=='--'){
                    break;
                }
                taskStr += arg[i]
                extra++;
            }
        }
        try{
        // Parses flags and filters parsed schedules into data to be processed
        let data = flagHandler(arg, parsedFiles, extra);

        // Passes filtered data from flags into user's command to be processed 
        cmdHandler(cmd, data, taskStr);
        } catch(error){
            console.log("invalid input")
        }

    }
    rl.close()

}

console.log("=== Welcome to Markdown Schedule Analyzer! ===")
Main();
