const parseLink = require('./parse-link.js')

function expectPair(input, expected) {
  expect(parseLink(input)).toEqual(expected)
}

function expectAll(expected, inputs) {
  inputs.forEach(input => expectPair(input, expected))
}

const withTrailingSlashesAlso = links => [
  ...links,
  ...links.map(link => link + '/')
]

describe('URL formatting', () => {
  test('defaults the scheme to HTTPS, removes www, and strips trailing slash', () => {
    expectPair('www.unknownsite.com/', {
      site: null,
      url: 'https://unknownsite.com'
    })
  })
})

describe('Different sites', () => {
  test('Twitter', () => {
    const exampleResult = {
      site: 'twitter',
      username: 'testman123',
      url: 'https://twitter.com/testman123'
    }
    expectAll(
      exampleResult,
      withTrailingSlashesAlso([
        'https://www.twitter.com/testman123',
        'http://www.twitter.com/testman123',
        'www.twitter.com/testman123',
        'twitter.com/testman123'
      ])
    )
  })

  test('LinkedIn', () => {
    expectAll(
      {
        site: 'linkedin',
        username: 'testman123',
        url: 'https://www.linkedin.com/in/testman123'
      },
      withTrailingSlashesAlso([
        'https://www.linkedin.com/in/testman123',
        'http://www.linkedin.com/in/testman123',
        'www.linkedin.com/in/testman123',
        'linkedin.com/in/testman123'
      ])
    )
  })

  test('GitHub', () => {
    expectAll(
      {
        site: 'github',
        username: 'testman123',
        url: 'https://github.com/testman123'
      },
      withTrailingSlashesAlso([
        'https://www.github.com/testman123',
        'http://www.github.com/testman123',
        'www.github.com/testman123',
        'github.com/testman123'
      ])
    )
  })

  test('Unrecognized site', () => {
    expectAll(
      {
        site: null,
        url: 'https://mysweethomepage.com'
      },
      withTrailingSlashesAlso([
        'https://www.mysweethomepage.com',
        'www.mysweethomepage.com',
        'mysweethomepage.com'
      ])
    )
  })

  test('Site with a non-www subdomain', () => {
    expectAll(
      {
        site: null,
        url: 'https://subdomain.mysweethomepage.com'
      },
      withTrailingSlashesAlso([
        'https://subdomain.mysweethomepage.com',
        'subdomain.mysweethomepage.com'
      ])
    )
  })
})

describe('Passing objects', () => {
  test('returns the same object, with no post-processing', () => {
    const testValue = { url: 'twitter.com/testman123/' }
    expectPair(testValue, testValue)
  })
})

describe('Throws', () => {
  test('when given a null', () => {
    expect(() => {
      parseLink(null)
    }).toThrow(Error)
  })
  test('when given an undefined', () => {
    expect(() => {
      parseLink(undefined)
    }).toThrow(Error)
  })
  test('when given a Number', () => {
    expect(() => {
      parseLink(1)
    }).toThrow(Error)
  })
})
