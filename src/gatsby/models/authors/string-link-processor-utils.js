/*
   Mod functions:

   signature: ({ scheme: string, host: string, pathname: string}, input = {})
   example:      ^ https://      ^ mysite.com  ^ /rest/of/the/url

   The first parameter will always reflect the groups parsed from the source by
   the regex.
   The second parameter will be the current state of the input, and usually will
   have to be spread into your return result.

   The processor function guarantees the second parameter will always at least
   be an empty object, and not undefined.
*/

/*
   The builder that makes link processors

   Takes a number of "mod" functions spread across position params for a nicer DSL-esque
   syntax.
   Returns a process function that starts with an empty object and pipes it
   through each mod function, exposing the groups captured by the regex as
   context on the first parameter.
*/
function processor(...mods) {
  return function process(groups) {
    return mods.reduce(
      (currentResult, _, i) => mods[i](groups, currentResult),
      {}
    )
  }
}

// Removes slashes from both ends of a string.
function trimSlashes(input) {
  return /^\/?(.*?)\/?$/.exec(input)[1]
}

// Convenience function for setting 'site' in a processor.
const asSite = site => (groups, input) => ({
  ...input,
  site
})

// Sets the username field to be the pathname with slashes trimmed.
const pathnameAsUsername = ({ pathname }, input) => ({
  ...input,
  username: trimSlashes(pathname)
})

// Sets the URL, ignoring the given scheme and always using https
// Good for big social media sites that are guaranteed to have https
const urlHTTPS = ({ host, pathname }, input) => ({
  ...input,
  url: 'https://' + host + pathname
})

// Sets the URL, adding 'https://' to inputs without a scheme.
const urlDefault = ({ scheme, host, pathname }, input) => ({
  ...input,
  url: (scheme || 'https://') + host + pathname
})

module.exports = {
  processor,
  trimSlashes,
  asSite,
  pathnameAsUsername,
  urlHTTPS,
  urlDefault
}
