"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIdleTime = (schedule, totalTime) => {
    let totalPlannedTime = 0;
    let currStart = 0;
    let reach = 0;
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].startTime < reach) {
            reach = Math.max(reach, schedule[i].endTime);
        }
        else {
            totalPlannedTime += reach - currStart;
            currStart = schedule[i].startTime;
            reach = schedule[i].endTime;
        }
    }
    totalPlannedTime += reach - currStart;
    return totalTime - totalPlannedTime;
};
exports.default = getIdleTime;
