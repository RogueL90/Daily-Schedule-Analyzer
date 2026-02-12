import { promises as fs} from "fs"
import path from 'node:path'
import getIdleTime from "./getIdleTime"
                          
interface TimeBlock {
    name: string,
    startTime: number,
    endTime: number
}

const parseFile = async (file: string) => {
    
    const schedule: TimeBlock[] = []
    
    function getTime(val: string, ind: number): { time: number, newInd: number } {
        try{
            let time = 0;
            let curr = ''
            while(val[ind]!== ':'){
                curr += val[ind]
                ind++;
            }
            curr = curr.replace(/\s/g, '');
            time += 60*Number(curr)
            while((val[ind] === ' ' || isNaN(Number(val[ind])))){
                ind++;
            }
            curr = ''
            while(val[ind]!==' ' && val[ind]!=='-'){
                curr += val[ind]
                ind++;
            }
            curr = curr.replace(/\s/g, '');
            if(curr[curr.length-1]==='m'){
                if(curr[curr.length-2]==='p'){
                    if(time!==720)
                    time+=720
                }
                curr = curr.slice(0, -2);
            }
            time+=Number(curr);
            return {
                time: time,
                newInd: ind
            }
        }
        catch(e: any){
            return {
                time: -1,
                newInd: -1
            }
        } 
    }

    function addToSchedule(val: string): boolean{
        val = val.trim();
        if(val.split(':').length<3 || !val.includes('-') || val===''){
            return false;
        }
        //console.log(val)
        let startTime;
        let endTime;
        let name;
        
        let ind = 0;
        const len = val.length
        while(ind<len && (val[ind] === ' ' || isNaN(Number(val[ind])))){
            ind++;
        }
        if( ind ===len ) return false;
        let ret = getTime(val, ind);
        if(ret.newInd === -1) return false;
        startTime = ret.time;
        ind = ret.newInd;
        //console.log(startTime)
        while(ind<len && (val[ind] === ' ' || isNaN(Number(val[ind])))){
            ind++;
        }
        if( ind ===len ) return false;
        ret = getTime(val, ind);
        if(ret.newInd === -1) return false;
        endTime = ret.time;
        if(endTime<=startTime){
            endTime+=1440
        }
        ind = ret.newInd;
        //console.log(endTime)
        while(val[ind]===' '){
            ind++;
        }
        name = val.substring(ind, len)
        //console.log(name)
        schedule.push({
            name: name,
            startTime: startTime,
            endTime: endTime
        })
        return true;
    }

    async function parse() {
        const contents = await fs.readFile(`./plannerDir/${file}`, "utf8");
        let lines: string[] = contents.split(/\r?\n/)
        let minTime = 1440;
        let maxTime = 0;
        lines.forEach(val => {
            if(addToSchedule(val)){
                minTime = Math.min(minTime, schedule[schedule.length-1].startTime)
                maxTime = Math.max(maxTime, schedule[schedule.length-1].endTime)
            }
        });
        return {
            minTime: minTime,
            maxTime: maxTime
        }
    }
    const criticalTimes = await parse();
    schedule.sort((a, b) => a.startTime - b.startTime)
    let date = path.basename(`./plannerDir/${file}`)
    date = date.slice(0,-3)
    return {
        schedule,
        date,
        earliest: criticalTimes.minTime,
        latest: criticalTimes.maxTime,
        idle: getIdleTime(schedule, criticalTimes.maxTime - criticalTimes.minTime)
    }
}

export default parseFile