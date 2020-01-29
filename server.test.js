const url = require('url')
const { processRedirectString, getRedirect } = require('./server')

describe('processRedirectString', () => {
  it('reads the regex, replacement and code', () => {
    const { regex, replace, code } = processRedirectString('^/foo /bar 418')

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toEqual('^\\/foo')
    expect(replace).toEqual('/bar')
    expect(code).toEqual(418)
  })
  it('code defaults to 301', () => {
    const { code } = processRedirectString('^/x /x')

    expect(code).toEqual(301)
  })
  it('detects whether we are matching a pathname or the whole url', () => {
    const { matchPathname } = processRedirectString('^/pathname /x')
    expect(matchPathname).toEqual(true)

    const { matchPathname: matchPathnameFalse } = processRedirectString(
      '^https://example.com/foo /x'
    )
    expect(matchPathnameFalse).toEqual(false)
  })
})

describe('getRedirect', () => {
  it('redirects to https while removing www', () => {
    const fakeReq = {
      headers: {
        'x-forwarded-proto': 'http'
      },
      url: '/foo/bar?baz'
    }
    expect(
      getRedirect('www.example.com', '/not-used', { req: fakeReq, dev: false })
    ).toEqual([301, 'https://example.com/foo/bar?baz'])
  })
  const itRedirects = (source, target, code = 301) => {
    const addHost = pathOrUrl => {
      if (pathOrUrl.startsWith('/')) {
        return `https://dvc.org${pathOrUrl}`
      }
      return pathOrUrl
    }

    it(`${source} -> ${target} (${code})`, () => {
      source = addHost(source)
      const { hostname, pathname } = url.parse(source)
      const [rCode, rLocation] = getRedirect(hostname, pathname)

      expect(rLocation).toEqual(target)
      expect(rCode).toEqual(code)

      // Detect redirect loops
      const secondUrl = url.parse(addHost(rLocation))
      const secondRedirect = getRedirect(secondUrl.hostname, secondUrl.pathname)
      expect(secondRedirect).toEqual([])
    })
  }

  describe('host redirects', () => {
    // remove the www (when already HTTPS)
    itRedirects('https://www.dvc.org/foo', 'https://dvc.org/foo')

    // short and sweet hosts
    itRedirects(
      'https://man.dvc.org/',
      'https://dvc.org/doc/command-reference/',
      303
    )
    itRedirects(
      'https://man.dvc.org/foo',
      'https://dvc.org/doc/command-reference/foo',
      303
    )
    itRedirects(
      'https://error.dvc.org/',
      'https://dvc.org/user-guide/troubleshooting#',
      303
    )
    itRedirects(
      'https://error.dvc.org/foo',
      'https://dvc.org/user-guide/troubleshooting#foo',
      303
    )
  })

  describe('redirects to s3', () => {
    itRedirects(
      'https://code.dvc.org/foo/bar',
      'https://s3-us-east-2.amazonaws.com/dvc-public/code/foo/bar',
      303
    )
    itRedirects(
      'https://data.dvc.org/foo/bar',
      'https://s3-us-east-2.amazonaws.com/dvc-public/data/foo/bar',
      303
    )
    itRedirects(
      'https://remote.dvc.org/foo/bar',
      'https://s3-us-east-2.amazonaws.com/dvc-public/remote/foo/bar',
      303
    )
    itRedirects(
      '/deb/foo',
      'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/deb/foo',
      303
    )
    itRedirects(
      '/rpm/foo',
      'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/rpm/foo',
      303
    )
  })

  describe('discord', () => {
    itRedirects('/help', 'https://discordapp.com/invite/dvwXA2N', 303)
    itRedirects('/chat', 'https://discordapp.com/invite/dvwXA2N', 303)
  })

  describe('in-site moves', () => {
    itRedirects('/docs/x', '/doc/x')
    itRedirects('/documentation/x', '/doc/x')
    itRedirects('/doc/commands-reference/add', '/doc/command-reference/add')
    itRedirects('/doc/tutorial/', '/doc/tutorials')
    itRedirects('/doc/tutorial/subject', '/doc/tutorials/deep/subject')
    itRedirects(
      '/doc/use-cases/data-and-model-files-versioning',
      '/doc/use-cases/versioning-data-and-model-files'
    )
  })
})
