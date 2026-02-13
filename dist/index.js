"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./utils/parseFile"));
const fs_1 = require("fs");
const promises_1 = require("node:readline/promises");
const node_process_1 = require("node:process");
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
        console.log("Enter next command, or --help for all lists of commands");
        const answer = await rl.question("> ");
        if (answer == "--help") {
            for (const line of helpMessage) {
                console.log(line);
            }
        }
    }
    rl.close();
}
console.log("=== Welcome to Markdown Schedule Analyzer! ===");
Main();
