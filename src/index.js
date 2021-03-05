const { generateData } = require("./generate-data");
const { randomDataConfig } = require("./random-data");
const { runRelativeImpact } = require("./run-relative-impact");
const { runRelativeImprovement } = require("./run-relative-improvement");


const config = randomDataConfig()
const data = generateData(config)

console.log('---------------------')
console.log('Relative Improvement:')
runRelativeImprovement(data)
console.log('---------------------')
console.log('Realtive Impact:')
runRelativeImpact(data)
console.log('---------------------')