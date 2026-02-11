"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_path_1 = __importDefault(require("node:path"));
const parseFile = async (file) => {
    const schedule = [];
    function getTime(val, ind) {
        try {
            let time = 0;
            let curr = '';
            while (val[ind] !== ':') {
                curr += val[ind];
                ind++;
            }
            curr = curr.replace(/\s/g, '');
            time += 60 * Number(curr);
            while ((val[ind] === ' ' || isNaN(Number(val[ind])))) {
                ind++;
            }
            curr = '';
            while (val[ind] !== ' ' && val[ind] !== '-') {
                curr += val[ind];
                ind++;
            }
            curr = curr.replace(/\s/g, '');
            if (curr[curr.length - 1] === 'm') {
                if (curr[curr.length - 2] === 'p') {
                    if (time !== 720)
                        time += 720;
                }
                curr = curr.slice(0, -2);
            }
            time += Number(curr);
            return {
                time: time,
                newInd: ind
            };
        }
        catch (e) {
            return {
                time: -1,
                newInd: -1
            };
        }
    }
    function addToSchedule(val) {
        val = val.trim();
        if (val.split(':').length < 3 || !val.includes('-') || val === '') {
            return false;
        }
        //console.log(val)
        let startTime;
        let endTime;
        let name;
        let ind = 0;
        const len = val.length;
        while (ind < len && (val[ind] === ' ' || isNaN(Number(val[ind])))) {
            ind++;
        }
        if (ind === len)
            return false;
        let ret = getTime(val, ind);
        if (ret.newInd === -1)
            return false;
        startTime = ret.time;
        ind = ret.newInd;
        //console.log(startTime)
        while (ind < len && (val[ind] === ' ' || isNaN(Number(val[ind])))) {
            ind++;
        }
        if (ind === len)
            return false;
        ret = getTime(val, ind);
        if (ret.newInd === -1)
            return false;
        endTime = ret.time;
        if (endTime <= startTime) {
            endTime += 1440;
        }
        ind = ret.newInd;
        //console.log(endTime)
        while (val[ind] === ' ') {
            ind++;
        }
        name = val.substring(ind, len);
        //console.log(name)
        schedule.push({
            name: name,
            startTime: startTime,
            endTime: endTime
        });
        return true;
    }
    async function parse() {
        const contents = await fs_1.promises.readFile(`./plannerDir/${file}`, "utf8");
        let lines = contents.split(/\r?\n/);
        let minTime = 1440;
        let maxTime = 0;
        lines.forEach(val => {
            if (addToSchedule(val)) {
                minTime = Math.min(minTime, schedule[schedule.length - 1].startTime);
                maxTime = Math.max(maxTime, schedule[schedule.length - 1].endTime);
            }
        });
        return {
            minTime: minTime,
            maxTime: maxTime
        };
    }
    const criticalTimes = await parse();
    schedule.sort((a, b) => a.startTime - b.startTime);
    let date = node_path_1.default.basename(`./plannerDir/${file}`);
    date = date.slice(0, -3);
    return {
        schedule,
        date: date,
        earliest: criticalTimes.minTime,
        latest: criticalTimes.maxTime,
    };
};
exports.default = parseFile;
