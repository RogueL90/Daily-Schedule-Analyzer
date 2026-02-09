import convTime from "./convTime"

const printSchedule = (prop: any) => {
    const schedule = prop.schedule
    for(const timeBlock of schedule){
        console.log(convTime(timeBlock.startTime)+ " - "+convTime(timeBlock.endTime)+": "+timeBlock.name)
    }
}

export default printSchedule;