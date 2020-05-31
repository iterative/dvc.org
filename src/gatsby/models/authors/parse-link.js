const processStringLink = require('./string-link-processor.js')

function WrongTypeError(type) {
  return new Error(`A ${type} cannot be used as input for parseLink!`)
}

function parseLink(input) {
  switch (typeof input) {
    // Handle shorthand string links
    case 'string':
      // Slice the 'www.' and trailing slash off of given hostnames to normalize them.
      // This regex matches every string, so we can be sure it matches every time.

      /*
         An explanation of the regex:

         1. Capture leading scheme (usually http/s) and :// in named group "scheme"

         2. Group but don't capture "www.", such that it is treated as if and
            equivalent to no provided subdomain. Other subdomains will be
            included in "host"

         3. Capture everything between here and the next / as "host"
            This technically includes a port if we ever include one.

         4. Capture the rest of the string, excluding leading and trailing
            slash, as "pathname"
      */
      const result = /^(?<scheme>.*?\/\/)?(?:www\.)?(?<host>[^\/]*)(?<pathname>.*?)\/?$/.exec(
        input
      )

      // Extract groups into variables and assign defaults to non-matches
      return processStringLink(result.groups)

    // Pass object links through
    case 'object':
      if (input === null) throw WrongTypeError('null')
      return input

    // Throw on anything else
    default:
      throw WrongTypeError(typeof input)
  }
}

module.exports = parseLink
