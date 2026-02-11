"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./parseFile"));
const printSchedule_1 = __importDefault(require("./printSchedule"));
const getIdleTime_1 = __importDefault(require("./getIdleTime"));
const fs_1 = require("fs");
async function parser() {
    const allFiles = await getAllFiles("");
    for (const planner of allFiles) {
        const file = await (0, parseFile_1.default)(planner);
        (0, printSchedule_1.default)(file);
        console.log("Total idle time of the day: " + (0, getIdleTime_1.default)(file) + " minutes");
        console.log("--------------------------------------------------------------------------------------------------------------");
    }
}
async function getAllFiles(filePath) {
    let arr = [];
    const path = "./plannerDir/" + filePath;
    const files = await fs_1.promises.readdir(path);
    for (const file of files) {
        const stat = await fs_1.promises.stat(path + "/" + file);
        if (stat.isDirectory()) {
            const tempArr = await getAllFiles(filePath + "/" + file);
            arr.push(...tempArr);
        }
        else {
            arr.push(filePath + "/" + file);
        }
    }
    return arr;
}
parser();
