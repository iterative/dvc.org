const tables = require('./tables.js')

module.exports = astNode => {
  if (astNode.lang == 'dvctable') {
    let table = tables.find(o => o.placeholder === astNode.value)
    if (table) {
      astNode.value = table.replacement
    }
  }

  return astNode
}
