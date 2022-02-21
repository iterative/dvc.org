const IS_CLIENT = ((): boolean => {
  let isDefined = false
  try {
    window
    isDefined = true
  } catch (x) {
    // nothing to do here, move on
  }
  return isDefined
})()

export default IS_CLIENT
