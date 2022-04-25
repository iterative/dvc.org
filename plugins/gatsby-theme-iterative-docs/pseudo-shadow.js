const path = require('path')
const pseudoShadow = modulePath => require(path.resolve(modulePath))
module.exports = pseudoShadow
