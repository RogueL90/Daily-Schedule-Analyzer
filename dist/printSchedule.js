"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convTime_1 = __importDefault(require("./convTime"));
const printSchedule = (prop) => {
    const schedule = prop.schedule;
    console.log(prop.date);
    for (const timeBlock of schedule) {
        console.log((0, convTime_1.default)(timeBlock.startTime) + " - " + (0, convTime_1.default)(timeBlock.endTime) + ": " + timeBlock.name);
    }
};
exports.default = printSchedule;
