const path = require('path')
const tagToSlug = require('../../../utils/shared/tagToSlug')
const {
  BLOG: { postsPerPage }
} = require('../../../consts')
const { paginate } = require('gatsby-awesome-pagination')
// Since blog pages and their indexes require a ton of image resizes, it's
// useful to have an option to only generate a minimal set of these pages when
// developing. Set LIMIT_BLOG_PAGES to anything truthy and this module will
// attempt to generate as few blog pages as possible while still having a bit of
// everything to look at.
const LIMIT_BLOG_PAGES = Boolean(process.env.LIMIT_BLOG_PAGES)

const createPages = async ({ graphql, actions: { createPage } }) => {
  const blogResponse = await graphql(
    `
      query BlogPageBuilderQuery($limit: Int) {
        allBlogPost(sort: { fields: [date], order: DESC }, limit: $limit) {
          tags: group(field: tags) {
            fieldValue
            pageInfo {
              itemCount
            }
          }
          nodes {
            slug
            id
          }
        }
      }
    `,
    {
      limit: LIMIT_BLOG_PAGES ? 1 : 9999
    }
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  const { tags, nodes: posts } = blogResponse.data.allBlogPost

  // Create home blog pages (with pagination)
  const blogHomeTemplate = path.resolve('./src/templates/blog-home.tsx')

  paginate({
    createPage,
    itemsPerPage: postsPerPage,
    itemsPerFirstPage: 10,
    pathPrefix: '/blog',
    items: posts,

    component: blogHomeTemplate,
    context: {
      isBlog: true
    }
  })

  // Create blog posts pages
  const blogPostTemplate = path.resolve('./src/templates/blog-post.tsx')

  const blogPagesPromise = Promise.all(
    posts.map(({ id, slug }, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1]
      const next = index === 0 ? null : posts[index - 1]

      createPage({
        component: blogPostTemplate,
        context: {
          isBlog: true,
          currentPage: index + 1,
          next,
          previous,
          id
        },
        path: slug
      })
    })
  )

  // Create tags pages (with pagination)
  const blogTagsTemplate = path.resolve('./src/templates/blog-tags.tsx')

  // We have to explicitly limit tag pages here, otherwise we get one for
  // every tag on the example post that makes images for a few children.
  // That can easily add hundreds of images because of the blog index template.
  const _tags = LIMIT_BLOG_PAGES ? tags.slice(0, 1) : tags

  const tagPagesPromise = Promise.all(
    _tags.map(({ fieldValue: tag, pageInfo: { itemCount } }) => {
      const basePath = `/blog/tags/${tagToSlug(tag)}`

      paginate({
        createPage,
        itemsPerPage: postsPerPage,
        component: blogTagsTemplate,
        items: { length: itemCount },
        pathPrefix: basePath,
        context: { tag }
      })
    })
  )

  return Promise.all([tagPagesPromise, blogPagesPromise])
}

module.exports = createPages
