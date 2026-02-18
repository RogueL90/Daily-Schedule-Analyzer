"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeSpent = (schedule, target) => {
    let totalTime = 0;
    let reach = 0;
    for (const activity of schedule) {
        let name = activity.name;
        name = name.toLowerCase();
        name = name.replace(/\s/g, '');
        // Reach variable to handle overlapping time intervals
        if (name != target || activity.endTime < reach) {
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
