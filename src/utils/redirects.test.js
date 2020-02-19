const url = require('url')
const { processRedirectString, getRedirect } = require('./redirects')

describe('processRedirectString', () => {
  it('reads the regex, replacement and code', () => {
    const { regex, replace, code } = processRedirectString('^/foo /bar 308')

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toEqual('^\\/foo')
    expect(replace).toEqual('/bar')
    expect(code).toEqual(308)
  })

  it('defaults to 301 response code', () => {
    const { code } = processRedirectString('^/x /y')

    expect(code).toEqual(301)
  })

  it('detects whether redirecting a full URL or just a path', () => {
    const { matchPathname: matchPathnameFalse } = processRedirectString(
      '^https://example.com/foo /x'
    )
    expect(matchPathnameFalse).toEqual(false)

    const { matchPathname } = processRedirectString('^/path /y')
    expect(matchPathname).toEqual(true)
  })
})

describe('getRedirects', () => {
  it('enforces HTTPS and removes www simultaneously', () => {
    const mockReq = {
      headers: {
        'x-forwarded-proto': 'http'
      },
      url: '/foo/bar?baz'
    }
    expect(
      getRedirect('www.example.com', '/not-used', { req: mockReq, dev: false })
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

      // Detect redirect loops.
      const secondUrl = url.parse(addHost(rLocation))
      const secondRedirect = getRedirect(secondUrl.hostname, secondUrl.pathname)
      expect(secondRedirect).toEqual([])
    })
  }

  describe('fromSubdomains', () => {
    // Remove www (when already HTTPS)
    itRedirects('https://www.dvc.org/foo', 'https://dvc.org/foo')

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
      'https://dvc.org/doc/user-guide/troubleshooting#',
      303
    )

    itRedirects(
      'https://error.dvc.org/foo',
      'https://dvc.org/doc/user-guide/troubleshooting#foo',
      303
    )
  })

  describe('toS3', () => {
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

  describe('toDiscord', () => {
    itRedirects('/help', 'https://discordapp.com/invite/dvwXA2N', 303)

    itRedirects('/chat', 'https://discordapp.com/invite/dvwXA2N', 303)
  })

  describe('fromPaths', () => {
    itRedirects('/docs/x', '/doc/x')

    itRedirects('/documentation/x', '/doc/x')

    itRedirects('/doc/commands-reference/foo', '/doc/command-reference/foo')

    itRedirects('/doc/tutorial', '/doc/tutorials')
    itRedirects('/doc/tutorial/', '/doc/tutorials')

    itRedirects('/doc/tutorial/bar', '/doc/tutorials/deep/bar')

    itRedirects(
      '/doc/use-cases/data-and-model-files-versioning',
      '/doc/use-cases/versioning-data-and-model-files'
    )
  })
})
