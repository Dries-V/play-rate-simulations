const validActivation = activationRate => activationRate > 0 && activationRate < 1

/**
 * @param {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]} data 
 * @returns {{
 *   No: number
 *   Nc: number
 *   Io: number
 *   Ic: number
 *   No1: number
 *   Nc1: number
 *   Io1: number
 *   Ic1: number
 *   No2: number
 *   Io2: number
 *   Nc2: number
 *   Ic2: number
 * }}
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

  // Raw
  const No = optimizedSamples.length
  const Nc = controlSamples.length
  const Io = optimizedSamples.reduce(
    (sum, { play }) => sum + play, 
    0
  )
  const Ic = controlSamples.reduce(
    (sum, { play }) => sum + play, 
    0
  )

  // Corrected for relative improvement
  const No1 = No + Nc
  const Nc1 = No + Nc
  const Io1 = optimizedSamples.reduce(
    (sum, { play, activation }) => sum + (play / activation), 
    0
  )
  const Ic1 = controlSamples.reduce(
    (sum, { play, activation }) => sum + (play / (1 - activation)), 
    0
  )

  // Play counts corrected for relative impact and net additional plays
  const No2 = No
  const Nc2 = No
  const Io2 = Io
  const Ic2 = controlSamples.reduce(
    (sum, { play, activation }) => sum + (play * (activation / (1 - activation))),
    0
  )
  
  return { No, Nc, Io, Ic, No1, Nc1, Io1, Ic1, No2, Nc2, Io2, Ic2 }
}

module.exports = { aggregateData }