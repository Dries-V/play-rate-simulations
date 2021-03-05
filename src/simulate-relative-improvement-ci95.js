const { Group, getPlayRateFactory } = require("./get-play-rate-factory")

const ITERATIONS = 1e5

/**
 * Simulate sub-populations separately.
 * Not corrected for Simpson's paradox.
 * @param {{
 *  optimized: { requests: number, playrate: number }
 *  control: { requests: number, playrate: number }
 *  overall: { requests: number, playrate: number }
 * }[]} data 
 * @param {number} iterations 
 */
const simulateRelativeImprovementCI95 = (
  data,
  iterations = ITERATIONS
) => {
  // Set up play rate sampling from Beta distributions
  const sampleOptimizedPlayRate = getPlayRateFactory(data, Group.OPTIMIZED)
  const sampleControlPlayRate = getPlayRateFactory(data, Group.CONTROL)
  
  // Set up relative improvement sampling
  const sampleRelativeImprovement = () =>
    (sampleOptimizedPlayRate() / sampleControlPlayRate()) - 1
  
  // Generate samples
  const samples = []
  for (let i = 0; i < iterations; i++) {
    samples.push(sampleRelativeImprovement())
  }

  // Return average and CI95
  const average = samples.reduce((sum, sam) => sum + sam) / samples.length
  samples.sort((a, b) => a - b)
  const CI95 = [
    samples[Math.floor(iterations * 0.025)],
    samples[Math.floor(iterations * 0.975)]
  ]
  return { average, CI95 }
}

module.exports = { simulateRelativeImprovementCI95 }