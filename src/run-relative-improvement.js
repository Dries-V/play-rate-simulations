const getTimer = require('execution-time')
const { aggregateData } = require('./aggregate-data')
const { aggregateDataPerRate } = require('./aggregate-data-per-rate')
const { prettyOutput } = require('./pretty-output')

const { simulateRelativeImprovementCI95 } = require('./simulate-relative-improvement-ci95')

const runRelativeImprovement = (data) => {
  const input = aggregateData(data)
  const inputPerRate = aggregateDataPerRate(data)

  const rawTimer = getTimer()
  rawTimer.start()
  const { average: rawM, CI95: rawCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: input.Ro },
    control: { requests: input.Nc, playrate: input.Rc },
    overall: { requests: input.N, playrate: input.R }
  }])
  const rawTime = rawTimer.stop().time

  const approximationTimer = getTimer()
  approximationTimer.start()
  const { average: approximationM, CI95: approximationCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: input.Ro1 },
    control: { requests: input.Nc, playrate: input.Rc1 },
    overall: { requests: input.N, playrate: input.R1 }
  }])
  const approximationTime = approximationTimer.stop().time

  const realisticTimer = getTimer()
  realisticTimer.start()
  const { average: realisticM, CI95: realisticCI95 } = simulateRelativeImprovementCI95(
    inputPerRate.map(({ N, No, Nc, I, Io, Ic }) => ({
      optimized: { requests: No, playrate: Io / No },
      control: { requests: Nc, playrate: Ic / Nc },
      overall: { requests: N, playrate: I / N }
    }))
  )
  const realisticTime = realisticTimer.stop().time

  const M = (input.Ro / input.Rc) - 1
  const M1 = (input.Io1 / input.Ic1) - 1
  console.log(`Raw:         \t${prettyOutput(M, rawM, rawCI95)} (${Math.floor(rawTime)}ms)`)
  console.log(`Realistic:   \t${prettyOutput(M1, realisticM, realisticCI95)} (${Math.floor(realisticTime)}ms)`)
  console.log(`Approximation:\t${prettyOutput(M1, approximationM, approximationCI95)} (${Math.floor(approximationTime)}ms)`)
}

module.exports = { runRelativeImprovement }