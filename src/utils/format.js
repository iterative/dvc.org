export function formatNumber(number) {
  try {
    return number.toLocaleString('en-US')
  } catch {
    return number
  }
}
