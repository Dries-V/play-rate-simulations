const beta = require('@stdlib/random/base/beta')

const SEED = 1337
const ITERATIONS = 1e5

/**
 * @param {{
 *  optimized: { requests: number, playrate: number }
 *  control: { requests: number, playrate: number }
 * }[]} data 
 * @param {boolean} fromOptimized
 * @returns {()=>number}
 */
const getPlayRateFactory = (data, fromOptimized) => {
  const populationSize = data.reduce(
    (
      sum, 
      { optimized, control }
    ) => sum + optimized.requests + control.requests, 
    0
  )
  const factories = data.map(({ optimized, control }) => {
    const { requests, playrate } = fromOptimized ? optimized : control
    const plays = requests * playrate
    const sample = beta.factory(
      Math.max(0.5, plays),
      Math.max(0.5, requests - plays),
      { seed: SEED }
    )
    const subPopulationSize = optimized.requests + control.requests
    const prob = subPopulationSize / populationSize
    return () => sample() * prob
  })
  return () => factories.reduce((sum, fact) => sum + fact(), 0)
}

/**
 * Simulate sub-populations separately.
 * Not corrected for Simpson's paradox.
 * @param {{
 *  optimized: { requests: number, playrate: number }
 *  control: { requests: number, playrate: number }
 * }[]} data 
 * @param {number} iterations 
 */
const simulateRelativeImprovementCI95PerRate = (
  data,
  iterations = ITERATIONS
) => {
  // Set up play rate sampling from Beta distributions
  const sampleOptimizedPlayRate = getPlayRateFactory(data, true)
  const sampleControlPlayRate = getPlayRateFactory(data, false)
  
  // Set up relative improvement sampling
  const sampleRelativeImprovement = () =>
    (sampleOptimizedPlayRate() / sampleControlPlayRate()) - 1
  
  // Generate samples
  const samples = []
  for (let i = 0; i < iterations; i++) {
    samples.push(sampleRelativeImprovement())
  }

  // Return percentiles
  samples.sort((a, b) => a - b)
  return [
    samples[Math.floor(iterations * 0.025)],
    samples[Math.floor(iterations * 0.975)]
  ]
}

module.exports = { simulateRelativeImprovementCI95PerRate }