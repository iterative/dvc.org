const GithubSlugger = require('github-slugger')

const slugger = new GithubSlugger()
const SLUG_REGEXP = /\s+{#([a-z0-9-]*[a-z0-9]+)}\s*$/

const extractSlugFromTitle = title => {
  // extracts expressions like {#too-many-files} from the end of a title
  const meta = title.match(SLUG_REGEXP)

  if (meta) {
    return [title.substring(0, meta.index), meta[1]]
  }
  return [title, slugger.slug(title)]
}

const parseHeadings = text => {
  const headingRegex = /\n(## \s*)(.*)/g
  const matches = []
  let match
  do {
    match = headingRegex.exec(text)
    if (match) {
      const [title, slug] = extractSlugFromTitle(match[2])
      matches.push({
        text: title,
        slug: slug
      })
    }
  } while (match)

  slugger.reset()
  return matches
}

const createPages = async (
  { graphql, actions },
  { defaultTemplate, getTemplate, disable }
) => {
  if (disable) return
  const docsResponse = await graphql(
    `
      {
        docs: allDocsPage(limit: 9999) {
          edges {
            node {
              id
              slug
              template
              parent {
                ... on MarkdownRemark {
                  rawMarkdownBody
                }
              }
            }
          }
        }
      }
    `
  )

  if (docsResponse.errors) {
    throw docsResponse.errors
  }

  docsResponse.data.docs.edges.forEach(doc => {
    const {
      node: {
        id,
        slug,
        template,
        parent: { rawMarkdownBody }
      }
    } = doc
    const headings = parseHeadings(rawMarkdownBody)

    if (slug) {
      actions.createPage({
        component: getTemplate(template, defaultTemplate),
        path: slug,
        context: {
          id,
          slug,
          isDocs: true,
          headings
        }
      })
    }
  })
}

module.exports = createPages
