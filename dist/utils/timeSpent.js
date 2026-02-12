"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeSpent = (schedule, target) => {
    let totalTime = 0;
    let reach = 0;
    for (const activity of schedule) {
        if (activity.name != target || activity.endTime < reach) {
            continue;
        }
        if (activity.startTime < reach) {
            totalTime += activity.endTime - reach;
        }
        else {
            totalTime += activity.endTime - activity.startTime;
        }
        reach = activity.endTime;
    }
    return totalTime;
};
exports.default = timeSpent;
