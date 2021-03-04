const beta = require('@stdlib/random/base/beta')

const SEED = 1337
const ITERATIONS = 1e5

/**
 * @param {{ requests: number, playrate: number }} data 
 * @returns {()=>number}
 */
const getPlayRateFactory = data => {
  const { requests, playrate } = data
  const plays = requests * playrate
  return beta.factory(
    Math.max(0.5, plays),
    Math.max(0.5, requests - plays),
    { seed: SEED }
  )
}

/**
 * @param {{
 *  optimized: { requests: number, playrate: number }
 *  control: { requests: number, playrate: number }
 * }} data 
 * @param {number} iterations 
 */
const simulateRelativeImprovementCI95 = (
  { optimized, control},
  iterations = ITERATIONS
) => {
  // Set up play rate sampling from Beta distributions
  const sampleOptimizedPlayRate = getPlayRateFactory(optimized)
  const sampleControlPlayRate = getPlayRateFactory(control)
  
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

module.exports = { simulateRelativeImprovementCI95 }