//utils/getArgs.js
export const getArgs = () => {
  const isMin = process.argv.includes("mini")
  return {isMin}
}