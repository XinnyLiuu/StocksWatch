const fs = require("fs");

// Tensorflow JS 
const tf = require("@tensorflow/tfjs");

/** 
 * Normalize dataset
 * 
 * https://sebastianraschka.com/Articles/2014_about_feature_scaling.html#about-min-max-scaling
 */
function normalize(value, min, max) {
    if (min === undefined || max === undefined) {
        return value;
    }

    return (value - min) / (max - min);
}

// Split csv into two
let lines = fs.readFileSync("./HUBS.csv").toString().split("\n");

// Get headerz
const header = lines[0].split(",").slice(0, 10);
for (let i = 1; i <= 7; i++) {
    header.splice(1, 1);
}

// Data constants
let lowMin = Number.MAX_SAFE_INTEGER;
let lowMax = 0;
let highMin = Number.MAX_SAFE_INTEGER;
let highMax = 0;
const TRAINING_LENGTH = Math.round(lines.length / 2);
const TEST_LENGTH = lines.length - Math.round(lines.length / 2);

// Get constants
lines = lines.splice(1, lines.length);
lines.forEach(l => {
    // Grab the date, low and high
    let temp = l.split(",").slice(0, 10);
    for (let i = 1; i <= 7; i++) {
        temp.splice(1, 1);
    }

    // Check for constants
    if (lowMin > parseInt(temp[2])) lowMin = parseInt(temp[2]);
    if (lowMax < parseInt(temp[2])) lowMax = parseInt(temp[2]);
    if (highMin > parseInt(temp[1])) highMin = parseInt(temp[1]);
    if (highMax < parseInt(temp[1])) highMax = parseInt(temp[1]);
});

fs.writeFileSync("./HUBS_1.csv", ""); // training
fs.writeFileSync("./HUBS_2.csv", ""); // test

fs.appendFileSync("./HUBS_1.csv", header + "\n");
for (let i = 0; i < lines.length / 2; i++) {
    // Grab the date, low and high
    let temp = lines[i].split(",").slice(0, 5);
    temp.splice(1, 1);
    temp.splice(1, 1);
    temp = temp.join(",");
    fs.appendFileSync("./HUBS_1.csv", temp + "\n");
}

fs.appendFileSync("./HUBS_2.csv", header + "\n");
for (let i = Math.round(lines.length / 2); i < lines.length; i++) {
    // Grab the date, low and high
    let temp = lines[i].split(",").slice(0, 5);
    temp.splice(1, 1);
    temp.splice(1, 1);
    temp = temp.join(",");
    fs.appendFileSync("./HUBS_2.csv", temp + "\n");
}

console.log(lowMax, lowMin, highMax, highMin);