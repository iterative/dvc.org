const {
  processor,
  asSite,
  pathnameAsUsername,
  urlHTTPS,
  urlDefault
} = require('./string-link-processor-utils.js')

/*
   Link Processors

   This file holds various link processors for recognizes Author link sites.
   They take the groups matched by a link parser regex in the Author model and
   build and return the object that will represent that link in GraphQL.

   The Processors are, but don't necessarily have to be, constructed of
   re-usable functions that pipe into each other while sharing the groups data.
   This seems complicated, but makes adding new recognized sites easy as not
   every site's links can be processed with the exact same logic.

   This file, however, is for the final build transformers to be associated with
   hostnames. The re-used functions are kept in a sister file for cleanliness.
*/

/*
   Match hostname keys to processors here.
*/
const processors = {
  'twitter.com': processor(asSite('twitter'), urlHTTPS, pathnameAsUsername),
  // LinkedIn is an example of a site that uses a special schema for usernames.
  // The site is thrown here in since the anonymous function isn't used anywhere else.
  'linkedin.com': processor(
    ({ pathname }) => ({
      site: 'linkedin',
      username: /^\/in\/(.*)/.exec(pathname)[1]
    }),
    urlHTTPS
  ),
  'github.com': processor(asSite('github'), urlHTTPS, pathnameAsUsername)
}

// Unrecognized URLS get a site field of null
const defaultProcessor = processor(asSite(null), urlDefault)

const processLink = groups =>
  (processors[groups.host] || defaultProcessor)(groups)

module.exports = processLink
