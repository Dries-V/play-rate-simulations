const getTimer = require('execution-time')

const { aggregateData } = require("./aggregate-data")
const { aggregateDataPerRate } = require("./aggregate-data-per-rate")
const { generateData } = require("./generate-data")
const { randomDataConfig } = require("./random-data")
const { simulateRelativeImprovementCI95 } = require("./simulate-realtive-improvement-ci95")

const prettyPercent = value => 
  `${value >= 0 ? ' ' : ''}${(value * 100).toFixed(2)}%`
const prettyOutput = (average, simulatedAverage, simulatedCI95) => 
  `${prettyPercent(average)} | Simulated: ${prettyPercent(simulatedAverage)} [ ${simulatedCI95.map(prettyPercent).join(' <-> ')} ]`

const main = () => {
  const config = randomDataConfig()
  const data = generateData(config)
  const input = aggregateData(data)
  const inputPerRate = aggregateDataPerRate(data)

  const Ro = input.Io / input.No
  const Rc = input.Ic / input.Nc
  const R = (input.Io + input.Ic) / (input.No + input.Nc)
  const M = (Ro / Rc) - 1

  const rawTimer = getTimer()
  rawTimer.start()
  const { average: rawM, CI95: rawCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: Ro },
    control: { requests: input.Nc, playrate: Rc },
    overall: { requests: input.Io + input.Ic, playrate: R }
  }])
  const rawTime = rawTimer.stop().time

  const Ro1 = input.Io1 / input.No1
  const Rc1 = input.Ic1 / input.Nc1
  const R1 = (input.Io1 + input.Ic1) / (input.No1 + input.Nc1)
  const M1 = (Ro1 / Rc1) - 1
  const approximationTimer = getTimer()
  approximationTimer.start()
  const { average: approximationM, CI95: approximationCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: Ro1 },
    control: { requests: input.Nc, playrate: Rc1 },
    overall: { requests: input.No + input.Nc, playrate: R1 }
  }])
  const approximationTime = approximationTimer.stop().time

  const realisticTimer = getTimer()
  realisticTimer.start()
  const { average: realisticM, CI95: realisticCI95 } = simulateRelativeImprovementCI95(
    inputPerRate.map(({ Io, No, Ic, Nc }) => ({
      optimized: { requests: No, playrate: Io / No },
      control: { requests: Nc, playrate: Ic / Nc },
      overall: { requests: No + Nc, playrate: (Io + Ic) / (No + Nc) }
    }))
  )
  const realisticTime = realisticTimer.stop().time

  console.log(`Raw:         \t${prettyOutput(M, rawM, rawCI95)} (${Math.floor(rawTime)}ms)`)
  console.log(`Realistic:   \t${prettyOutput(M1, realisticM, realisticCI95)} (${Math.floor(realisticTime)}ms)`)
  console.log(`Approximation:\t${prettyOutput(M1, approximationM, approximationCI95)} (${Math.floor(approximationTime)}ms)`)
}

main()