/* eslint-env node */

class Redirect {
  constructor(regex, target) {
    this.regex = regex
    this.target = target
  }
}
class HostRedirect extends Redirect {
  getLocation(host, pathname) {
    if (this.regex.test(host)) {
      return this.target(host, pathname)
    }
  }
}
class PathnameRedirect extends Redirect {
  getLocation(host, pathname) {
    if (this.regex.test(pathname)) {
      return this.target(pathname)
    }
  }
}

exports.redirects = [
  new HostRedirect(
    /^www/,
    (host, pathname) => `https://${host.replace(/^www\./, '')}${pathname}`
  ),
  new HostRedirect(
    /^man.dvc.org$/,
    (host, pathname) => `https://dvc.org/doc/command-reference${pathname}`
  ),
  new HostRedirect(
    /^error.dvc.org$/,
    (host, pathname) =>
      `https://dvc.org/doc/user-guide/troubleshooting#${pathname.substring(1)}`
  ),
  new HostRedirect(
    /^(code|data|remote)\.dvc\.org$/,
    (host, pathname) =>
      'https://s3-us-east-2.amazonaws.com/dvc-public/' +
      host.split('.')[0] +
      pathname
  ),
  new PathnameRedirect(
    new RegExp('^/(deb|rpm)/.*$'),
    pathname =>
      'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/' + pathname.substring(1)
  ),
  new PathnameRedirect(
    new RegExp('^/(help|chat)/?$'),
    () => 'https://discordapp.com/invite/dvwXA2N'
  ),
  new PathnameRedirect(new RegExp('^/(docs|documentation)(/.*)?$'), pathname =>
    pathname.replace(new RegExp('^/(docs|documentation)'), '/doc')
  ),
  new PathnameRedirect(
    new RegExp('^/doc/commands-reference(/.*)?$'),
    pathname =>
      pathname.replace('/doc/commands-reference', '/doc/command-reference')
  ),
  new PathnameRedirect(new RegExp('^/doc/tutorial/?$'), pathname =>
    pathname.replace(new RegExp('^/doc/tutorial/?'), '/doc/tutorials')
  ),
  new PathnameRedirect(new RegExp('^/doc/tutorial/(.*)?'), pathname =>
    pathname.replace('/doc/tutorial/', '/doc/tutorials/deep/')
  ),
  new PathnameRedirect(
    new RegExp('^/doc/use-cases/data-and-model-files-versioning/?$'),
    () => '/doc/use-cases/versioning-data-and-model-files'
  )
]
