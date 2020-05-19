const {
  dateIsExpired,
  getExpirationFields,
  getExpirationDate
} = require('./expiration.js')

const moment = require('moment')

const now = moment()
const tomorrow = moment(now).add(1, 'days')
const sixDaysAgo = moment(now).subtract(6, 'days')
const sevenDaysAgo = moment(now).subtract(7, 'days')
const eightDaysAgo = moment(now).subtract(8, 'days')

describe('dateIsExpired', () => {
  it('Returns Boolean true when given a Moment six days ago', () => {
    expect(dateIsExpired(sixDaysAgo)).toEqual(true)
  })

  it('Returns Boolean false when given a Moment tomorrow', () => {
    expect(dateIsExpired(tomorrow)).toEqual(false)
  })
})

describe('getExpirationDate', () => {
  it('Gives a default value of 7 days past date when given no expires', () => {
    expect(getExpirationDate({ date: sevenDaysAgo })).toEqual(now)
  })

  it('Returns null when given an expires of false, despite date', () => {
    expect(getExpirationDate({ date: sevenDaysAgo, expires: false })).toEqual(
      null
    )
  })
})

describe('getExpirationFields', () => {
  it('Returns a the right value for 7 days ago and no expires', () => {
    expect(getExpirationFields({ date: sevenDaysAgo })).toEqual({
      expires: now.toDate(),
      expired: true
    })
  })

  it('Returns a the right value for 7 days ago and an expires for tomorrow', () => {
    expect(
      getExpirationFields({ date: sevenDaysAgo, expires: tomorrow })
    ).toEqual({
      expires: tomorrow.toDate(),
      expired: false
    })
  })

  it('Returns a the right value for expires=false', () => {
    expect(getExpirationFields({ date: eightDaysAgo, expires: false })).toEqual(
      {
        expires: null,
        expired: false
      }
    )
  })
})
