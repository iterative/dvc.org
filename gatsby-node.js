/* eslint-env node */

const fs = require('fs')
const path = require('path')
const GithubSlugger = require('github-slugger')
const { createFilePath } = require('gatsby-source-filesystem')
const tagToSlug = require('./src/utils/tagToSlug')
const paginatablePageGenerator = require('./src/utils/paginatablePageGenerator')
const { siteMetadata } = require('./gatsby-config')

const { getItemBySource } = require('./src/utils/sidebar')

const remark = require('remark')
const remarkHTML = require('remark-html')

const markdownToHtml = remark().use(remarkHTML).processSync
const slugger = new GithubSlugger()

// Generate hedings data from markdown

const SLUG_REGEXP = /\s+{#([a-z0-9-]*[a-z0-9]+)}\s*$/

function extractSlugFromTitle(title) {
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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const contentPath = path.join(__dirname, 'content')
    const source = node.fileAbsolutePath.replace(contentPath, '')
    let value

    if (source.startsWith('/blog')) {
      value = createFilePath({
        getNode,
        node,
        trailingSlash: false
      }).replace(/^\/blog\/[0-9\-]*/, '/blog/')

      // Convert fields in frontmatter from markdown to html
      const {
        frontmatter: { descriptionLong, pictureComment }
      } = node

      if (descriptionLong) {
        node.frontmatter.descriptionLong = markdownToHtml(
          descriptionLong
        ).contents
      }

      if (pictureComment) {
        node.frontmatter.pictureComment = markdownToHtml(
          pictureComment
        ).contents
      }
      // end Convert fields
    } else {
      value = getItemBySource(source).path
    }

    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  // DOCS
  const docsResponse = await graphql(
    `
      {
        docs: allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/content/docs/" } }
          limit: 9999
        ) {
          edges {
            node {
              rawMarkdownBody
              fields {
                slug
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

  const docComponent = path.resolve('./src/templates/doc.js')

  docsResponse.data.docs.edges.forEach(doc => {
    const headings = parseHeadings(doc.node.rawMarkdownBody)

    if (doc.node.fields.slug) {
      actions.createPage({
        component: docComponent,
        path: doc.node.fields.slug,
        context: {
          isDocs: true,
          slug: doc.node.fields.slug,
          headings
        }
      })
    }
  })

  // Blog
  const blogResponse = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
          limit: 9999
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
        home: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
          limit: 9999
        ) {
          pageInfo {
            itemCount
          }
        }
        tags: allMarkdownRemark(limit: 9999) {
          group(field: frontmatter___tags) {
            fieldValue
            pageInfo {
              itemCount
            }
          }
        }
      }
    `
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  // Create home blog pages (with pagination)
  const blogHomeTemplate = path.resolve('./src/templates/blog-home.tsx')

  for (const page of paginatablePageGenerator({
    basePath: '/blog',
    hasHeroItem: true,
    itemCount: blogResponse.data.home.pageInfo.itemCount
  })) {
    actions.createPage({
      component: blogHomeTemplate,
      path: page.path,
      context: {
        isBlog: true,
        ...page.context
      }
    })
  }

  // Create blog posts pages
  const blogPostTemplate = path.resolve('./src/templates/blog-post.tsx')
  const posts = blogResponse.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    actions.createPage({
      component: blogPostTemplate,
      context: {
        isBlog: true,
        currentPage: index + 1,
        next,
        previous,
        slug: post.node.fields.slug
      },
      path: post.node.fields.slug
    })
  })

  // Create tags pages (with pagination)
  const blogTagsTemplate = path.resolve('./src/templates/blog-tags.tsx')

  blogResponse.data.tags.group.forEach(
    ({ fieldValue: tag, pageInfo: { itemCount } }) => {
      const basePath = `/tags/${tagToSlug(tag)}`

      for (const page of paginatablePageGenerator({ basePath, itemCount })) {
        actions.createPage({
          component: blogTagsTemplate,
          path: page.path,
          context: { tag, ...page.context }
        })
      }
    }
  )
}

const is404Regexp = /^\/404/
const trailingSlashRegexp = /\/$/

exports.onCreatePage = ({ page, actions }) => {
  // Set necessary flags for pageContext
  const newPage = {
    ...page,
    context: {
      ...page.context,
      is404: is404Regexp.test(page.path)
    }
  }

  // Remove trailing slash
  if (page.path !== '/' && trailingSlashRegexp.test(newPage.path)) {
    newPage.path = newPage.path.replace(trailingSlashRegexp, '')
  }

  if (newPage !== page) {
    actions.deletePage(page)
    actions.createPage(newPage)
  }
}

// Ignore warnings about CSS inclusion order, because we use CSS modules.
// https://spectrum.chat/gatsby-js/general/having-issue-related-to-chunk-commons-mini-css-extract-plugin~0ee9c456-a37e-472a-a1a0-cc36f8ae6033?m=MTU3MjYyNDQ5OTAyNQ==
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'build-javascript') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}
