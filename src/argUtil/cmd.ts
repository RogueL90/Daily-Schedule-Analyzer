import convTime from '../utils/convTime'
import convHrs from '../utils/convHrs'
import timeSpent from "../utils/timeSpent"
import printSchedule from "../utils/printSchedule"

const cmdHandler = (cmd: string, data: any[], taskStr: string) => {
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
            
        } else if(cmd === 'task') {
            const target = taskStr.replace(/\s/g, "").toLowerCase()
            let timeSpentList = []
            let sum = 0;
            let max = 0;
            for(let i = 0; i<data.length; i++){
                timeSpentList[i] = timeSpent(data[i].schedule, target)
                sum += timeSpentList[i]
                max = Math.max(max, timeSpentList[i])
            }
            for(let i = 0; i<data.length; i++){
                process.stdout.write(`${data[i].date}:`);
                for(let k = 0; k<Math.round((timeSpentList[i]/max)*50); k++){
                    process.stdout.write('|')
                }
                console.log()
            }
            if(data.length===1){
                console.log(`Displayed time spent on ${taskStr} for ${data[0].date}.`)
            }else{
                console.log(`Displayed time spent on ${taskStr} for dates between ${data[0].date} and ${data[data.length-1].date}.`)
            }
        } else if(cmd === 'idle'){
            let idleList = []
            let sum = 0;
            let max = 0;
            for(let i = 0; i<data.length; i++){
                idleList[i] = data[i].idle
                sum += idleList[i]
                max = Math.max(max, idleList[i])
            }
            for(let i = 0; i<data.length; i++){
                process.stdout.write(`${data[i].date}:`);
                for(let k = 0; k<Math.round((idleList[i]/max)*50); k++){
                    process.stdout.write('|')
                }
                console.log()
            }
            if(data.length===1){
                console.log(`Displayed unplanned (idle) time for ${data[0].date}.`)
            }else{
                console.log(`Displayed unplanned (idle) time for dates between ${data[0].date} and ${data[data.length-1].date}.`)
            }
        }
}

export default cmdHandler