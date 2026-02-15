"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./utils/parseFile"));
const printSchedule_1 = __importDefault(require("./utils/printSchedule"));
const fs_1 = require("fs");
const promises_1 = require("node:readline/promises");
const node_process_1 = require("node:process");
const convTime_1 = __importDefault(require("./utils/convTime"));
const convHrs_1 = __importDefault(require("./utils/convHrs"));
const parsedFiles = [];
let len;
const helpMessage = [
    "cmd 1 - does this",
    "cmd 2 - does that"
];
async function parser() {
    const allFiles = await getAllFiles("");
    for (const planner of allFiles) {
        const file = await (0, parseFile_1.default)(planner);
        parsedFiles.push(file);
    }
    parsedFiles.sort((a, b) => a.date.localeCompare(b.date));
    len = parsedFiles.length;
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
async function Main() {
    await parser();
    //console.log(parsedFiles)
    const rl = (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout });
    while (true) {
        console.log("Enter an argument, or 'sa help' for list of commands");
        const res = await rl.question("> ");
        let arg = res.split(" ").slice(1);
        arg = arg.filter(val => val !== '');
        arg.forEach(val => val.toLowerCase);
        const cmd = arg[0];
        if (cmd === "help") {
            for (const line of helpMessage) {
                console.log(line);
            }
            continue;
        }
        if (cmd === "term") {
            break;
        }
        let data = [];
        // Read flags & store schedules to be processed in data variable
        try {
            if (arg[1] === '--all') {
                data = parsedFiles;
            }
            else if (arg[1] === '--last') {
                data = parsedFiles.slice(len - Math.min(len, Number(arg[2])));
            }
            else if (arg[1] === '--first') {
                data = parsedFiles.slice(0, Math.min(len, Number(arg[2])));
            }
            else if (arg[1] === '--from') {
                let from = -1;
                let to = -1;
                if (!isNaN(Number(arg[2]))) {
                    from = Math.min(len - 1, Number(arg[2])) - 1;
                }
                else {
                    for (let i = 0; i < len; i++) {
                        if (parsedFiles[i].date === arg[2]) {
                            from = i;
                            break;
                        }
                    }
                }
                if (arg[3] !== '--to') {
                    to = len;
                }
                else {
                    if (!isNaN(Number(arg[4]))) {
                        to = Number(arg[4]);
                    }
                    else {
                        for (let i = from + 1; i < len; i++) {
                            if (parsedFiles[i].date > arg[4]) {
                                to = i;
                                break;
                            }
                            else if (parsedFiles[i].date === arg[4]) {
                                to = i + 1;
                                break;
                            }
                        }
                    }
                }
                data = parsedFiles.slice(from, to);
            }
            else {
                if (!isNaN(Number(arg[1]))) {
                    data.push(parsedFiles[Math.min(len, Number(arg[1]) - 1)]);
                }
                else {
                    data.push(parsedFiles.filter(schedule => schedule.date === arg[1]));
                }
            }
        }
        catch (error) {
            console.log(`invalid argument, showing stats for ${cmd} for past ${Math.min(len, 7)} days instead!`);
            data = parsedFiles.slice(len - Math.min(len, 7));
        }
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
    }
    rl.close();
}
console.log("=== Welcome to Markdown Schedule Analyzer! ===");
Main();
