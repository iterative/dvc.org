const moment = require('moment')

const DEFAULT_EXPIRATION_OFFSET = { days: 7 }

/*
   Get the expiration date for an object with date and/or expires fields
   If expires is given, return it as a moment
   If expires is undefined, return date plus 7 days
   If expires is false, return false, as the item never expires.
*/
function getExpirationDate({ date, expires }) {
  return expires === undefined
    ? moment(expires)
    : expires === false
    ? false
    : moment(date).add(DEFAULT_EXPIRATION_OFFSET)
}

function isExpired(expires) {
  return expires && expires.isBefore(moment())
}

module.exports = {
  isExpired,
  getExpirationDate
}
