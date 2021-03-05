const SUB_POPULATIONS = 10
const SUB_POPULATION_SIZE = 1e5

const randomDataConfig = () => {
  const config = []
  for (let i = 0; i < SUB_POPULATIONS; i++) {
    config.push({
      count: SUB_POPULATION_SIZE,
      activation: Math.random(),
      playRateOptimized: Math.random(),
      playRateControl: Math.random()
    })
  }
  return config
}

module.exports = { randomDataConfig }