const path = require('path')
const pseudoShadow = modulePath => {
  try {
    return require(
      path.resolve('src', '@dvcorg', 'gatsby-theme-iterative', modulePath)
    )
  } catch {
    return require(path.resolve(__dirname, 'src', modulePath))
  }
}
module.exports = pseudoShadow
