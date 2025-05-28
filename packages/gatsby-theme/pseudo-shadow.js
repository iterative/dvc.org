const path = require('path')
const pseudoShadow = modulePath => {
  try {
    return require(path.resolve('src', '@dvcorg', 'gatsby-theme', modulePath))
  } catch {
    return require(path.resolve(__dirname, 'src', modulePath))
  }
}
module.exports = pseudoShadow
