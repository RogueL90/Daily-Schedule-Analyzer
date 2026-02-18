"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convTime_1 = __importDefault(require("../utils/convTime"));
const convHrs_1 = __importDefault(require("../utils/convHrs"));
const timeSpent_1 = __importDefault(require("../utils/timeSpent"));
const printSchedule_1 = __importDefault(require("../utils/printSchedule"));
const cmdHandler = (cmd, data, taskStr) => {
    let totalIdle = 0;
    let totalEarliest = 0;
    let totalLatest = 0;
    if (cmd === 'summary') {
        for (const day of data) {
            (0, printSchedule_1.default)(day);
            totalIdle += day.idle;
            totalEarliest += day.earliest;
            totalLatest += day.latest;
            console.log();
            console.log(`Idle (unplanned) time: ${(0, convHrs_1.default)(day.idle)}`);
            console.log(`Earliest scheduled time: ${(0, convTime_1.default)(day.earliest)}`);
            console.log(`Latest scheduled time: ${(0, convTime_1.default)(day.latest)}`);
            console.log();
        }
        console.log("----------------------------------------------------------------------------------------------------------");
        console.log();
        console.log(`Average idle time: ${(0, convHrs_1.default)(totalIdle / data.length)}`);
        console.log(`Average easliest scheduled time: ${(0, convTime_1.default)(totalEarliest / data.length)}`);
        console.log(`Average latest scheduled time: ${(0, convTime_1.default)(totalLatest / data.length)}`);
        if (data.length === 1) {
            console.log(`Displayed summary for ${data[0].date}.`);
        }
        else {
            console.log(`Displayed summary for dates between ${data[0].date} and ${data[data.length - 1].date}.`);
        }
        console.log();
        console.log("----------------------------------------------------------------------------------------------------------");
    }
    else if (cmd === 'tasks') {
        const reduce = (str) => {
            return str.replace(/\s/g, '').toLowerCase();
        };
        let uniqueTasks = new Map();
        for (let i = 0; i < data.length; i++) {
            for (const currTask of data[i].schedule) {
                const reduced = reduce(currTask.name);
                const exists = uniqueTasks.get(reduced);
                if (exists) {
                    exists.timeSpent += currTask.endTime - currTask.startTime;
                }
                else {
                    uniqueTasks.set(reduced, { name: currTask.name, timeSpent: currTask.endTime - currTask.startTime });
                }
            }
        }
        let tasks = Array.from(uniqueTasks.values());
        tasks = tasks.sort((a, b) => b.timeSpent - a.timeSpent);
        for (const task of tasks) {
            console.log(`${(0, convHrs_1.default)(task.timeSpent)} spent on ${task.name}.`);
        }
        console.log();
        if (data.length === 1) {
            console.log(`Displayed tasks for ${data[0].date}.`);
        }
        else {
            console.log(`Displayed tasks for dates between ${data[0].date} and ${data[data.length - 1].date}.`);
        }
    }
    else if (cmd === 'task') {
        const target = taskStr.replace(/\s/g, "").toLowerCase();
        let timeSpentList = [];
        let sum = 0;
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            timeSpentList[i] = (0, timeSpent_1.default)(data[i].schedule, target);
            sum += timeSpentList[i];
            max = Math.max(max, timeSpentList[i]);
        }
        for (let i = 0; i < data.length; i++) {
            process.stdout.write(`${data[i].date}:`);
            for (let k = 0; k < Math.round((timeSpentList[i] / max) * 50); k++) {
                process.stdout.write('|');
            }
            console.log();
        }
        if (data.length === 1) {
            console.log(`Displayed time spent on ${taskStr} for ${data[0].date}.`);
        }
        else {
            console.log(`Displayed time spent on ${taskStr} for dates between ${data[0].date} and ${data[data.length - 1].date}.`);
        }
    }
    else if (cmd === 'idle') {
        let idleList = [];
        let sum = 0;
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            idleList[i] = data[i].idle;
            sum += idleList[i];
            max = Math.max(max, idleList[i]);
        }
        for (let i = 0; i < data.length; i++) {
            process.stdout.write(`${data[i].date}:`);
            for (let k = 0; k < Math.round((idleList[i] / max) * 50); k++) {
                process.stdout.write('|');
            }
            console.log();
        }
        if (data.length === 1) {
            console.log(`Displayed unplanned (idle) time for ${data[0].date}.`);
        }
        else {
            console.log(`Displayed unplanned (idle) time for dates between ${data[0].date} and ${data[data.length - 1].date}.`);
        }
    }
};
exports.default = cmdHandler;
