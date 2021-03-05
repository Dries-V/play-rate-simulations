const beta = require('@stdlib/random/base/beta')
const SEED = 1337

/** @type {{
 *  OPTIMIZED: 'optimized'
 *  CONTROL: 'control'
 *  OVERALL: 'overall'
 * }} 
 */
const Group = {
  OPTIMIZED: 'optimized',
  CONTROL: 'control',
  OVERALL: 'overall'
}

/**
 * @param {{
 *  optimized: { requests: number, playrate: number }
 *  control: { requests: number, playrate: number }
 *  overall: { requests: number, playrate: number }
 * }[]} data 
 * @param {'optimized'|'control'|'overall'} group
 * @returns {()=>number}
 */
const getPlayRateFactory = (data, group) => {
  const populationSize = data.reduce(
    (
      sum, 
      { optimized, control }
    ) => sum + optimized.requests + control.requests, 
    0
  )
  const factories = data.map((subPopulation) => {
    const { requests, playrate } = subPopulation[group]
    const plays = requests * playrate
    const sample = beta.factory(
      Math.max(0.5, plays),
      Math.max(0.5, requests - plays),
      { seed: SEED }
    )
    const subPopulationSize = subPopulation.overall.requests
    const prob = subPopulationSize / populationSize
    return () => sample() * prob
  })
  return () => factories.reduce((sum, fact) => sum + fact(), 0)
}

module.exports = { Group, getPlayRateFactory }