const SUB_POPULATIONS = 10
const SUB_POPULATION_SIZE = 1e5

const random = () => Math.min(0.99, Math.max(0.01, Math.random()))

const randomDataConfig = () => {
  const config = []
  for (let i = 0; i < SUB_POPULATIONS; i++) {
    config.push({
      count: SUB_POPULATION_SIZE,
      activation: random(),
      playRateOptimized: random(),
      playRateControl: random()
    })
  }
  return config
}

module.exports = { randomDataConfig }