"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convTime = (val) => {
    const hour = Math.floor(val / 60);
    const minutes = val - hour * 60;
    let meridiem;
    if (val < 720 || val >= 1440) {
        meridiem = "am";
    }
    else {
        meridiem = "pm";
    }
    return "" + hour + ":" + (minutes < 10 ? 0 + "" + minutes : minutes) + meridiem;
};
exports.default = convTime;
