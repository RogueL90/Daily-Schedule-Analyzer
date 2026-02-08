"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = __importDefault(require("./parseFile"));
async function parser() {
    const res = await (0, parseFile_1.default)("myFile.txt");
    console.log(res);
    return res;
}
parser();
