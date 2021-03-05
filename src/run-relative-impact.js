const getTimer = require('execution-time')
const { aggregateData } = require('./aggregate-data')
const { aggregateDataPerRate } = require('./aggregate-data-per-rate')
const { prettyOutput } = require('./pretty-output')

const { simulateRelativeImpactCI95 } = require("./simulate-relative-impact-ci95")

const runRelativeImpact = (data) => {
  const input = aggregateData(data)
  const inputPerRate = aggregateDataPerRate(data)

  const rawTimer = getTimer()
  rawTimer.start()
  const { average: rawC, CI95: rawCI95 } = simulateRelativeImpactCI95([{
    optimized: { requests: input.No, playrate: input.Ro },
    control: { requests: input.Nc, playrate: input.Rc },
    overall: { requests: input.N, playrate: input.R }
  }])
  const rawTime = rawTimer.stop().time

  const approximationTimer = getTimer()
  approximationTimer.start()
  const { average: approximationC, CI95: approximationCI95 } = simulateRelativeImpactCI95([{
    optimized: { requests: input.No, playrate: input.Ro2 },
    control: { requests: input.Nc, playrate: input.Rc2 },
    overall: { requests: input.N, playrate: input.R2 }
  }])
  const approximationTime = approximationTimer.stop().time

  const realisticTimer = getTimer()
  realisticTimer.start()
  const { average: realisticC, CI95: realisticCI95 } = simulateRelativeImpactCI95(
    inputPerRate.map(({ N, No, Nc, I, Io, Ic }) => ({
      optimized: { requests: No, playrate: Io / No },
      control: { requests: Nc, playrate: Ic / Nc },
      overall: { requests: N, playrate: I / N }
    }))
  )
  const realisticTime = realisticTimer.stop().time

  const C = (input.Ro / input.Rc) - 1
  const C2 = ((input.Io2 + input.Ic2) / (2 * input.Ic2)) - 1
  console.log(`Raw:         \t${prettyOutput(C, rawC, rawCI95)} (${Math.floor(rawTime)}ms)`)
  console.log(`Realistic:   \t${prettyOutput(C2, realisticC, realisticCI95)} (${Math.floor(realisticTime)}ms)`)
  console.log(`Approximation:\t${prettyOutput(C2, approximationC, approximationCI95)} (${Math.floor(approximationTime)}ms)`)
}

module.exports = { runRelativeImpact }