const timeSpent = (schedule: any, target: string) => {
    let totalTime = 0
    let reach =0
    for(const activity of schedule){
        if(activity.name != target || activity.endTime<reach){
            continue
        }
        if(activity.startTime<reach){
            totalTime += activity.endTime - reach
        } else {
            totalTime += activity.endTime - activity.startTime
        }
        reach = activity.endTime
    }
    return totalTime
}

export default timeSpent;