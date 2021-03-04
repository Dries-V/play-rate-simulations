const { roll } = require('./roll')

/**
 * @param {{ 
 *   count: number
 *   activation: number
 *   playRateOptimized: number
 *   playRateControl: number
 * }[]} config 
 * @returns {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]}
 */
const generateData = (config) => {
  const data = []
  for (const { 
    count, 
    activation, 
    playRateOptimized, 
    playRateControl 
  } of config) {
    for (let i = 0; i < count; i++) {
      /** @type {{
       *  optimized: 0|1
       *  activation: number
       *  play: 0|1
       * }}
       */
      const sample = {
        optimized: roll(activation) ? 1 : 0,
        activation,
        play: 0
      }
      if (
        (sample.optimized === 1 && roll(playRateOptimized)) ||
        (sample.optimized === 0 && roll(playRateControl))
      ) {
        sample.play = 1
      }
      data.push(sample)
    }
  }
  return data
}

module.exports = { generateData }