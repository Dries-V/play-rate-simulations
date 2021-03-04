const { aggregateData } = require("./aggregate-data")
const { aggregateDataPerRate } = require("./aggregate-data-per-rate")
const { generateData } = require("./generate-data")
const { randomDataConfig } = require("./random-data")
const { simulateRelativeImprovementCI95 } = require("./simulate-realtive-improvement-ci95")
const { simulateRelativeImprovementCI95PerRate } = require("./simulate-realtive-improvement-ci95-per-rate")

const prettyPercent = value => 
  `${value >= 0 ? ' ' : ''}${(value * 100).toFixed(2)}%`
const prettyOutput = (average, cid) => 
  `${prettyPercent(average)} [ ${cid.map(prettyPercent).join(' <-> ')} ]`

const main = () => {
  const config = randomDataConfig()
  const data = generateData(config)
  const input = aggregateData(data)
  const inputPerRate = aggregateDataPerRate(data)

  const Ro = input.Io / input.No
  const Rc = input.Ic / input.Nc
  const M = (Ro / Rc) - 1
  const M_CI95 = simulateRelativeImprovementCI95({
    optimized: { requests: input.No, playrate: Ro },
    control: { requests: input.Nc, playrate: Rc }
  })
  console.log(`Raw:         \t${prettyOutput(M, M_CI95)}`)

  const Ro1 = input.Io1 / input.No1
  const Rc1 = input.Ic1 / input.Nc1
  const M1 = (Ro1 / Rc1) - 1
  const M1_CI95 = simulateRelativeImprovementCI95({
    optimized: { requests: input.No, playrate: Ro1 },
    control: { requests: input.Nc, playrate: Rc1 }
  })

  const M1_CI95_per_rate = simulateRelativeImprovementCI95PerRate(
    inputPerRate.map(({ Io, No, Ic, Nc }) => ({
      optimized: { requests: No, playrate: Io / No },
      control: { requests: Nc, playrate: Ic / Nc }
    }))
  )
  console.log(`Realistic:   \t${prettyOutput(M1, M1_CI95_per_rate)}`)
  console.log(`Approximation:\t${prettyOutput(M1, M1_CI95)}`)
}

main()