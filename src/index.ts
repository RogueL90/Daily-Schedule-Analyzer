import parseFile from "./parseFile"
import printSchedule from "./printSchedule"
import getIdleTime from "./getIdleTime"
import { promises as fs } from "fs"

async function parser(){
const plannerDir = await fs.readdir("./plannerDir")
console.log(plannerDir)
for(const planner of plannerDir){
    console.log(planner)
    const file = await parseFile(planner)
    printSchedule(file)
    console.log(getIdleTime(file))
}
}

parser();