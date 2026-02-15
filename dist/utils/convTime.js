"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Convert minutes to time form to display parsed schedule data
const convTime = (val) => {
    val = Math.round(val);
    let hour = Math.floor(val / 60);
    const minutes = val - hour * 60;
    let meridiem;
    if (val < 720 || val >= 1440) {
        meridiem = "am";
        if (val >= 1500) {
            hour -= 24;
        }
        else if (val >= 1440) {
            hour -= 12;
        }
    }
    else {
        meridiem = "pm";
        if (hour > 12) {
            hour -= 12;
        }
    }
    return "" + hour + ":" + (minutes < 10 ? 0 + "" + minutes : minutes) + meridiem;
};
exports.default = convTime;
