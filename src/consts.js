/* eslint-env node */

const WEBSITE_HOST = 'dvc.org'

const FORUM_URL = `https://discuss.${WEBSITE_HOST}`

const PAGE_DOC = '/doc'

const BLOG = {
  imageMaxWidth: 700,
  imageMaxWidthHero: 850,

  // Changing this has a negative SEO impact
  postsPerPage: 9,
  // This is so that we know how many posts to remove from a feed page with
  // a hero item on top to make up for its height. MUST be smaller than
  // postsPerPage.
  postsPerRow: 3
}

module.exports = {
  FORUM_URL,
  BLOG,
  PAGE_DOC
}
