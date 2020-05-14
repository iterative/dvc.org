const moment = require('moment')

const DEFAULT_EXPIRATION_OFFSET = { days: 7 }

/*
   Get the expiration date for an object with date and/or expires fields
   If expires is given, return it as a moment
   If expires is undefined, return date plus 7 days
   If expires is false, return false, as the item never expires.
*/
function getExpirationDate({ date, expires }) {
  if (expires === false) return null
  if (expires) return moment(expires)
  if (date) return moment(date).add(DEFAULT_EXPIRATION_OFFSET)
  return null
}

/*
   This is the primary logic to check if a date is expired,
   It simply uses Moment to parse a date input and comparse that to the current
   time.
   Use this on the result of getExpirationDate to get both pieces of
   information.
*/
function dateIsExpired(expires) {
  return Boolean(expires && expires.isBefore(moment()))
}

/*
   This convenience function provides both the expiration date as a JS Date as
   well as a boolean telling if that date is expired.

   The returned expiration date is formatted from a moment to a JS Date for Gatsby
   The fields from this function are ready to add to a node as-is
*/
function getExpirationFields(input) {
  const expires = getExpirationDate(input)
  return {
    expires: expires && expires.toDate(),
    expired: dateIsExpired(expires)
  }
}

module.exports = {
  dateIsExpired,
  getExpirationFields,
  getExpirationDate
}
