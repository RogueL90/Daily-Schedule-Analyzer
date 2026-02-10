const getIdleTime = (prop: any): number => {
    const totalTime: number = prop.latest-prop.earliest
    const schedule = prop.schedule
    let totalPlannedTime: number = 0
    let currStart = 0
    let reach = 0
    for(let i = 0; i<schedule.length; i++){
        if(schedule[i].startTime<reach){
            reach = Math.max(reach, schedule[i].endTime)
        }
        else{
            totalPlannedTime += reach -currStart
            currStart = schedule[i].startTime
            reach = schedule[i].endTime
        }
    }
    totalPlannedTime +=reach-currStart
    return totalTime - totalPlannedTime
}

export default getIdleTime