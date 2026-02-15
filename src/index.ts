import parseFile from "./utils/parseFile"
import printSchedule from "./utils/printSchedule"
import { promises as fs } from "fs"
import timeSpent from "./utils/timeSpent"
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import convTime from './utils/convTime'
import convHrs from './utils/convHrs'

const parsedFiles: any[]= [];
let len: number;
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
len = parsedFiles.length
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

        let data = [];
        // Read flags & store schedules to be processed in data variable
        try{
            if(arg[1]==='--all'){
                data = parsedFiles
            }else if(arg[1]==='--last'){
                data = parsedFiles.slice(len-Math.min(len, Number(arg[2])))
            }else if(arg[1]==='--first'){
                data = parsedFiles.slice(0, Math.min(len, Number(arg[2])));
            }else if(arg[1]==='--from'){
                let from: number = -1;
                let to: number = -1;
                if(!isNaN(Number(arg[2]))){
                    from = Math.min(len-1,Number(arg[2]))-1
                }else{
                    for(let i = 0; i<len; i++){
                        if(parsedFiles[i].date===arg[2]){
                            from = i;
                            break;
                        }
                    }
                }
                if(arg[3]!=='--to'){
                    to = len
                }else{
                if(!isNaN(Number(arg[4]))){
                    to = Number(arg[4])
                }else{
                    for(let i = from+1; i<len; i++){
                        if(parsedFiles[i].date>arg[4]){
                            to = i
                            break;
                        }else if(parsedFiles[i].date===arg[4]){
                            to = i+1
                            break;
                        }
                    }
                }
                }
                data = parsedFiles.slice(from, to)
            }else{
                if(!isNaN(Number(arg[1]))){
                    data.push(parsedFiles[Math.min(len,Number(arg[1])-1)])
                } else {
                    data.push(parsedFiles.filter(schedule => schedule.date===arg[1]))
                }
            }

        }catch(error){
            console.log(`invalid argument, showing stats for ${cmd} for past ${Math.min(len,7)} days instead!`)
            data = parsedFiles.slice(len-Math.min(len, 7))
        }

        let totalIdle = 0
        let totalEarliest = 0
        let totalLatest = 0
        if(cmd === 'summary'){
            for(const day of data){
                printSchedule(day)
                totalIdle+=day.idle
                totalEarliest += day.earliest
                totalLatest += day.latest
                console.log()
                console.log(`Idle (unplanned) time: ${convHrs(day.idle)}`)
                console.log(`Earliest scheduled time: ${convTime(day.earliest)}`)
                console.log(`Latest scheduled time: ${convTime(day.latest)}`)
                console.log()
            }
            console.log("----------------------------------------------------------------------------------------------------------")
            console.log()
            console.log(`Average idle time: ${convHrs(totalIdle/data.length)}`)
            console.log(`Average easliest scheduled time: ${convTime(totalEarliest/data.length)}`)
            console.log(`Average latest scheduled time: ${convTime(totalLatest/data.length)}`)
            if(data.length===1){
                console.log(`Displayed summary for ${data[0].date}.`)
            }else{
                console.log(`Displayed summary for dates between ${data[0].date} and ${data[data.length-1].date}.`)
            }
            console.log()
            console.log("----------------------------------------------------------------------------------------------------------")
        } else if (cmd === 'tasks'){
            const reduce = (str: string): string => {
                return str.replace(/\s/g, '').toLowerCase()
            }
            interface Pair {
                name: string,
                timeSpent: number
            }
            let uniqueTasks: Map<string, Pair> = new Map();
            for(let i = 0; i<data.length; i++){
                for(const currTask of data[i].schedule){
                    const reduced = reduce(currTask.name) 
                    const exists =  uniqueTasks.get(reduced)
                    if(exists){
                        exists.timeSpent +=currTask.endTime - currTask.startTime
                    } else{
                        uniqueTasks.set(reduced, {name: currTask.name, timeSpent: currTask.endTime-currTask.startTime})
                    }
                }
            }
            let tasks = Array.from(uniqueTasks.values())
            tasks = tasks.sort((a, b) => b.timeSpent - a.timeSpent)
            for(const task of tasks){
                console.log(`${convHrs(task.timeSpent)} spent on ${task.name}.`)
            }
            console.log()
            if(data.length===1){
                console.log(`Displayed tasks for ${data[0].date}.`)
            }else{
                console.log(`Displayed tasks for dates between ${data[0].date} and ${data[data.length-1].date}.`)
            }
            
        }

    }
    rl.close()

}

console.log("=== Welcome to Markdown Schedule Analyzer! ===")
Main();
