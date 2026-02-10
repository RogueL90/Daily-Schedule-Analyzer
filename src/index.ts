import parseFile from "./parseFile"
import printSchedule from "./printSchedule"
import getIdleTime from "./getIdleTime"

async function parser(){
const res = await parseFile("myFile.md")
printSchedule(res)
console.log(getIdleTime(res))
return res;
}

const info = parser();