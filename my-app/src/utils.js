export function softmax(arr) {
  const C = Math.max(...arr)
  const d = arr.map(y => Math.exp(y - C)).reduce((a, b) => a + b)
  return arr.map((value, index) => {
    return Math.exp(value - C) / d
  })
}
