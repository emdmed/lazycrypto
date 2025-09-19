//utils/getArgs.js
export const getArgs = () => {
  const isMin = process.argv.includes("mini")
  const isString = process.argv.includes("string")

  return { isMin, isString }
}
