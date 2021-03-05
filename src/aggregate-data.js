const { calculateAggregates } = require('./calculate-aggregates')

const validActivation = activationRate => activationRate > 0 && activationRate < 1

/**
 * @param {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]} data
 */
const aggregateData = data => {
  const optimizedSamples = data.filter(
    ({ 
      optimized, 
      activation 
    }) => optimized === 1 && validActivation(activation)
  )
  const controlSamples = data.filter(
    ({ 
      optimized, 
      activation 
    }) => optimized === 0 && validActivation(activation)
  )
  return calculateAggregates(optimizedSamples, controlSamples)
}

module.exports = { aggregateData }