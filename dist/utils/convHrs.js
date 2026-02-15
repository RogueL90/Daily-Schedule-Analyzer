"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Convert minutes to hours and minutes in the form "X hour(s) Y minute(s)"
const convHrs = (val) => {
    val = Math.round(val);
    const hours = Math.floor(val / 60);
    const mins = val % 60;
    let hrString;
    let minString;
    if (hours === 0) {
        hrString = "";
    }
    else if (hours === 1) {
        hrString = "1 hour";
    }
    else {
        hrString = hours + " hours";
    }
    if (mins === 0) {
        minString = "";
    }
    else if (mins === 1) {
        minString = "1 minute";
    }
    else {
        minString = mins + " minutes";
    }
    return hrString + (hrString === "" ? "" : " ") + minString;
};
exports.default = convHrs;
