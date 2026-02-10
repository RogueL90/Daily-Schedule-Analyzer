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
    const plannerDir = await fs_1.promises.readdir("./plannerDir");
    console.log(plannerDir);
    for (const planner of plannerDir) {
        console.log(planner);
        const file = await (0, parseFile_1.default)(planner);
        (0, printSchedule_1.default)(file);
        console.log((0, getIdleTime_1.default)(file));
    }
}
parser();
