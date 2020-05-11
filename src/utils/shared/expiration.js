const moment = require('moment')

const DEFAULT_EXPIRATION_OFFSET = { days: 7 }

function isExpired({ date, expires }) {
  // If no expiry date is defined, use the regular date plus a default offset.
  if (expires === undefined) {
    return isExpired({ expires: moment(date).add(DEFAULT_EXPIRATION_OFFSET) })
  }
  return moment(expires).isBefore(moment())
}

module.exports = {
  isExpired
}
