import parseFile from "./parseFile"
import printSchedule from "./printSchedule"
import getIdleTime from "./getIdleTime"
import { promises as fs } from "fs"

async function parser(){
const allFiles: string[] = await getAllFiles("")
for(const planner of allFiles){
    const file = await parseFile(planner)
    printSchedule(file)
    console.log("Total idle time of the day: "+getIdleTime(file)+" minutes")
    console.log("--------------------------------------------------------------------------------------------------------------")
}
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