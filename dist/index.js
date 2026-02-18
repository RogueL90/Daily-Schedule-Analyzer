"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./utils/parseFile"));
const fs_1 = require("fs");
const promises_1 = require("node:readline/promises");
const node_process_1 = require("node:process");
const flags_1 = __importDefault(require("./argUtil/flags"));
const cmd_1 = __importDefault(require("./argUtil/cmd"));
const parsedFiles = [];
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
        let extra = 0;
        let taskStr = "";
        if (cmd === "task") {
            for (let i = 1; i < arg.length; i++) {
                if (arg[i].length > 2 && arg[i].slice(0, 2) == '--') {
                    break;
                }
                taskStr += arg[i];
                extra++;
            }
        }
        // Parses flags and filters parsed schedules into data to be processed
        let data = (0, flags_1.default)(arg, parsedFiles, extra);
        // Passes filtered data from flags into user's command to be processed 
        (0, cmd_1.default)(cmd, data, taskStr);
    }
    rl.close();
}
console.log("=== Welcome to Markdown Schedule Analyzer! ===");
Main();
