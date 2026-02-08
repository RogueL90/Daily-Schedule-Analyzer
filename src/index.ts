import parseFile from "./parseFile"

async function parser(){
const res = await parseFile("myFile.txt")
console.log(res)
return res;
}

parser();