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
  const M = (Ro / Rc) - 1
  const { average: rawM, CI95: rawCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: Ro },
    control: { requests: input.Nc, playrate: Rc }
  }])
  console.log(`Raw:         \t${prettyOutput(M, rawM, rawCI95)}`)

  const Ro1 = input.Io1 / input.No1
  const Rc1 = input.Ic1 / input.Nc1
  const M1 = (Ro1 / Rc1) - 1
  const { average: approximationM, CI95: approximationCI95 } = simulateRelativeImprovementCI95([{
    optimized: { requests: input.No, playrate: Ro1 },
    control: { requests: input.Nc, playrate: Rc1 }
  }])

  const { average: realisticM, CI95: realisticCI95 } = simulateRelativeImprovementCI95(
    inputPerRate.map(({ Io, No, Ic, Nc }) => ({
      optimized: { requests: No, playrate: Io / No },
      control: { requests: Nc, playrate: Ic / Nc }
    }))
  )
  console.log(`Realistic:   \t${prettyOutput(M1, realisticM, realisticCI95)}`)
  console.log(`Approximation:\t${prettyOutput(M1, approximationM, approximationCI95)}`)
}

main()