/*
   Processor builder: makes a function that turns a string into processed Link metadata

   Takes "Mod functions" as parameters, returns a function that starts with {} and pipes
   that through each function, then returns the result.

   signature: ({ scheme: string, host: string, pathname: string}, input)
   example:      ^ https://      ^ mysite.com  ^ /rest/of/the/url ^ an object

   The second parameter will be the current state of the input, and usually will
   have to be spread into your return result.
 */
function processor(...mods) {
  return function process(groups) {
    return mods.reduce(
      (currentResult, _, i) => mods[i](groups, currentResult),
      {}
    )
  }
}

// Processor helpers

function trimSlashes(input) {
  return /^\/?(.*?)\/?$/.exec(input)[1]
}

const asSite = site => (groups, input) => ({
  ...input,
  site
})

const pathnameAsUsername = ({ pathname }, input) => ({
  ...input,
  username: trimSlashes(pathname)
})

const urlHTTPS = ({ host, pathname }, input) => ({
  ...input,
  url: 'https://' + host + pathname
})

const urlDefault = ({ scheme, host, pathname }, input) => ({
  ...input,
  url: (scheme || 'https://') + host + pathname
})

function WrongTypeError(type) {
  return new Error(`A ${type} cannot be used as input for parseLink!`)
}

// Building processors for recognized sites

const processors = {
  'twitter.com': processor(asSite('twitter'), urlHTTPS, pathnameAsUsername),
  'github.com': processor(asSite('github'), urlHTTPS, pathnameAsUsername),
  'linkedin.com': processor(
    // Handle LinkedIn as a special case
    ({ pathname }) => ({
      site: 'linkedin',
      username: /^\/in\/(.*)/.exec(pathname)[1]
    }),
    urlHTTPS
  )
}
const defaultProcessor = processor(asSite(null), urlDefault)

const processStringLink = groups =>
  (processors[groups.host] || defaultProcessor)(groups)

function parseLink(input) {
  switch (typeof input) {
    // Handle shorthand string links
    case 'string':
      const result = /^(?<scheme>.*?\/\/)?(?:www\.)?(?<host>[^\/]*)(?<pathname>.*?)\/?$/.exec(
        input
      )

      // Extract groups into variables and assign defaults to non-matches
      return processStringLink(result.groups)

    // Pass object links through
    case 'object':
      // typeof null is object, so handle that
      if (input === null) throw WrongTypeError('null')
      return input

    // Throw on anything else
    default:
      throw WrongTypeError(typeof input)
  }
}

module.exports = parseLink
