const prettyPercent = value => 
  `${value >= 0 ? ' ' : ''}${(value * 100).toFixed(2)}%`
const prettyOutput = (average, simulatedAverage, simulatedCI95) => 
  `${prettyPercent(average)} | Simulated: ${prettyPercent(simulatedAverage)} [ ${simulatedCI95.map(prettyPercent).join(' <-> ')} ]`

module.exports = { prettyOutput }