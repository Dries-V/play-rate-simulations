const { runRelativeImpact } = require("./run-relative-impact");
const { runRelativeImprovement } = require("./run-relative-improvement");

console.log('---------------------')
console.log('Relative Improvement:')
runRelativeImprovement()
console.log('---------------------')
console.log('Realtive Impact:')
runRelativeImpact()
console.log('---------------------')