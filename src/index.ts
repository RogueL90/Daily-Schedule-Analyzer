import parseFile from "./utils/parseFile"
import printSchedule from "./utils/printSchedule"
import { promises as fs } from "fs"
import timeSpent from "./utils/timeSpent"

const parsedFiles: any[]= [];

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

parser();

