const { calculateAggregates } = require("./calculate-aggregates")

const validActivation = activationRate => activationRate > 0 && activationRate < 1

/**
 * @param {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]} data
 */
const aggregateDataPerRate = data => {
  const results = []
  const rates = new Set(data.map(({ activation }) => activation))

  for (const rate of rates) {
    const optimizedSamples = data.filter(
      ({ 
        optimized, 
        activation 
      }) => activation === rate && optimized === 1 && validActivation(activation)
    )
    const controlSamples = data.filter(
      ({ 
        optimized, 
        activation 
      }) => activation === rate && optimized === 0 && validActivation(activation)
    )    
    results.push(calculateAggregates(optimizedSamples, controlSamples))
  }
  return results
}

module.exports = { aggregateDataPerRate }