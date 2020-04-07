const getCustomProperties = (() => {
  let cssDecl: CSSStyleDeclaration

  return () => {
    if (!cssDecl) {
      cssDecl = getComputedStyle(document.documentElement, null)
    }

    return cssDecl
  }
})()

export const getCustomProperty = (() => {
  const IS_PX_VALUE = /px$/
  const cachedValues: { [key: string]: number | string } = {}

  return (name: string) => {
    if (!cachedValues[name]) {
      const all = getCustomProperties()
      const value = all.getPropertyValue(name).trim()

      if (IS_PX_VALUE.test(value)) {
        return parseInt(value, 10)
      }

      cachedValues[name] = value
    }

    return cachedValues[name]
  }
})()
