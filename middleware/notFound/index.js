/* eslint-env node */

const path = require('path')

module.exports = (req, res) => {
  res.sendFile(path.join(`${__dirname}`, '..', '..', 'public', '404.html'))
}
