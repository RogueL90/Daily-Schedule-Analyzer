"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./parseFile"));
const printSchedule_1 = __importDefault(require("./printSchedule"));
async function parser() {
    const res = await (0, parseFile_1.default)("myFile.txt");
    (0, printSchedule_1.default)(res);
    return res;
}
const info = parser();
