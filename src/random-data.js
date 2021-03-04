const randomDataConfig = () => {
  const config = []
  for (let i = 0; i < 10; i++) {
    config.push({
      count: 1e5,
      activation: Math.random(),
      playRateOptimized: Math.random(),
      playRateControl: Math.random()
    })
  }
  return config
}

module.exports = { randomDataConfig }