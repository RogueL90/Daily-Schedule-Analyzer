const flagHandler = (arg: string[], parsedFiles: any[], extra: number) => {
    const len = parsedFiles.length
    let data = []
        try{
            if(arg[1+extra]==='--all'){
                data = parsedFiles
            }else if(arg[1+extra]==='--last'){
                data = parsedFiles.slice(len-Math.min(len, Number(arg[2])))
            }else if(arg[1+extra]==='--first'){
                data = parsedFiles.slice(0, Math.min(len, Number(arg[2])));
            }else if(arg[1+extra]==='--from'){
                let from: number = -1;
                let to: number = -1;
                if(!isNaN(Number(arg[2+extra]))){
                    from = Math.min(len-1,Number(arg[2+extra]))-1
                }else{
                    for(let i = 0; i<len; i++){
                        if(parsedFiles[i].date===arg[2+extra]){
                            from = i;
                            break;
                        }
                    }
                }
                if(arg[3+extra]!=='--to'){
                    to = len
                }else{
                if(!isNaN(Number(arg[4+extra]))){
                    to = Number(arg[4+extra])
                }else{
                    for(let i = from+1; i<len; i++){
                        if(parsedFiles[i].date>arg[4+extra]){
                            to = i
                            break;
                        }else if(parsedFiles[i].date===arg[4+extra]){
                            to = i+1
                            break;
                        }
                    }
                }
                }
                data = parsedFiles.slice(from, to)
            }else{
                if(!isNaN(Number(arg[1+extra]))){
                    data.push(parsedFiles[Math.min(len,Number(arg[1+extra])-1)])
                } else {
                    data.push(parsedFiles.filter(schedule => schedule.date===arg[1+extra]))
                }
            }

        }catch(error){
            console.log(`invalid argument, showing stats for ${arg[0]} for past ${Math.min(len,7)} days instead!`)
            data = parsedFiles.slice(len-Math.min(len, 7))
        }
        return data
}

export default flagHandler