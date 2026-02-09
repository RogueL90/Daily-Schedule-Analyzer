import parseFile from "./parseFile"
import printSchedule from "./printSchedule"

async function parser(){
const res = await parseFile("myFile.txt")
printSchedule(res)
return res;
}

const info = parser();