/**
 * @param {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]} optimizedSamples 
 * @param {{
 *  optimized: 0|1
 *  activation: number
 *  play: 0|1
 * }[]} controlSamples 
 */
const calculateAggregates = (
  optimizedSamples,
  controlSamples
) => {
  // Raw
  const No = optimizedSamples.length
  const Nc = controlSamples.length
  const N = No + Nc
  const Io = optimizedSamples.reduce(
    (sum, { play }) => sum + play, 
    0
  )
  const Ic = controlSamples.reduce(
    (sum, { play }) => sum + play, 
    0
  )
  const I = Io + Ic
  const R = I / N
  const Ro = Io / No
  const Rc = Ic / Nc

  // Corrected for relative improvement
  const No1 = No + Nc
  const Nc1 = No + Nc
  const N1 = No1 + Nc1
  const Io1 = optimizedSamples.reduce(
    (sum, { play, activation }) => sum + (play / activation), 
    0
  )
  const Ic1 = controlSamples.reduce(
    (sum, { play, activation }) => sum + (play / (1 - activation)), 
    0
  )
  const I1 = Io1 + Ic1
  const R1 = I1 / N1
  const Ro1 = Io1 / No1
  const Rc1 = Ic1 / Nc1 

  // Play counts corrected for relative impact and net additional plays
  const No2 = No
  const Nc2 = No // not a typo!
  const N2 = No2 + Nc2
  const Io2 = Io
  const Ic2 = controlSamples.reduce(
    (sum, { play, activation }) => sum + (play * (activation / (1 - activation))),
    0
  )
  const I2 = Io2 + Ic2
  const R2 = I2 / N2
  const Ro2 = Io2 / No2
  const Rc2 = Ic2 / Nc2
  
  return { 
    N,
    No, 
    Nc, 
    I,
    Io, 
    Ic, 
    R,
    Ro,
    Rc, 
    N1,
    No1, 
    Nc1,
    I1,
    Io1, 
    Ic1, 
    R1,
    Ro1,
    Rc1, 
    N2,
    No2, 
    Nc2, 
    I2,
    Io2, 
    Ic2,
    R2,
    Ro2,
    Rc2 
  }
}

module.exports = { calculateAggregates }