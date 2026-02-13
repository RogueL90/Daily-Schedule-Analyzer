import parseFile from "./utils/parseFile"
import printSchedule from "./utils/printSchedule"
import { promises as fs } from "fs"
import timeSpent from "./utils/timeSpent"
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

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
        console.log("Enter next command, or --help for all lists of commands")
        const answer = await rl.question("> ")
        if(answer == "--help"){
            for(const line of helpMessage){
                console.log(line)
            }
        }
    }

    rl.close()

}

console.log("=== Welcome to Markdown Schedule Analyzer! ===")
Main();
