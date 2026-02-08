"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const schedule = [];
const parseFile = async (file) => {
    function getTime(val, len, ind) {
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
            if (curr[curr.length - 1] === 'm' && curr[curr.length - 2] === 'p') {
                curr = curr.slice(0, -2);
                if (time !== 720)
                    time += 720;
            }
            else if (time === 720) {
                time = 0;
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
            return;
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
            return;
        let ret = getTime(val, len, ind);
        if (ret.newInd === -1)
            return;
        startTime = ret.time;
        ind = ret.newInd;
        //console.log(startTime)
        while (ind < len && (val[ind] === ' ' || isNaN(Number(val[ind])))) {
            ind++;
        }
        if (ind === len)
            return;
        ret = getTime(val, len, ind);
        if (ret.newInd === -1)
            return;
        endTime = ret.time;
        ind = ret.newInd;
        //console.log(endTime)
        while (val[ind] === ' ') {
            ind++;
        }
        name = val.substring(ind, len);
        //console.log(name)
        schedule.push({
            name: name,
            time: endTime - startTime
        });
    }
    async function parse() {
        const contents = await fs_1.promises.readFile(`./sourceFile/${file}`, "utf8");
        let lines = contents.split(/\r?\n/);
        lines.forEach(val => addToSchedule(val));
    }
    await parse();
    return schedule;
};
exports.default = parseFile;
