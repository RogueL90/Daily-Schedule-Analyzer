
const convTime = (val: number) => {
    let hour: number = Math.floor(val/60);
    const minutes: number = val-hour*60;
    let meridiem: string;
    if(val<720 || val>=1440){
        meridiem = "am"
        if(val>=1500){
            hour-=24
        }else if(val>=1440){
            hour-=12
        }
    } else{
        meridiem = "pm"
        hour-=12
    }
    return "" + hour+":"+(minutes<10 ? 0 + "" + minutes: minutes)+meridiem 
}

export default convTime