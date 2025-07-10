module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  getUrlWithoutParams: str => {
    try {
      const url = new URL(str)
      return url.origin + url.pathname
    } catch {
      return ''
    }
  },
  parseBoolean: str => {
    return ['True', 'true', '1', true].includes(str)
  }
}
