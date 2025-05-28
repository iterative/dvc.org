const { imageWrapperClass } = require('gatsby-remark-images/constants')
const { convertHastToHtml } = require('./convertHast.js')

const rootToAbsolute = siteUrl => async tree => {
  const { selectAll } = await import('hast-util-select')
  selectAll('a', tree).forEach(node => {
    if (node.properties.href.startsWith('/')) {
      node.properties.href = siteUrl + node.properties.href
    }
  })
  selectAll('img', tree).forEach(node => {
    if (node.properties.src.startsWith('/')) {
      node.properties.src = siteUrl + node.properties.src
    }
  })
  return tree
}

const unwrapImages = () => async tree => {
  const { select, selectAll } = await import('hast-util-select')
  selectAll(`.${imageWrapperClass}`, tree).forEach(node => {
    // Set the fallback image as the wrapper's only child, and then
    // give that image the wrapper's original style.
    const fallbackImg = select('img', node)
    node.children = [
      {
        ...fallbackImg,
        properties: {
          ...fallbackImg.properties,
          style: 'max-width: 100%; margin: auto;'
        }
      }
    ]
  })
  return tree
}

async function makeFeedHtml(htmlAst, siteUrl) {
  const { unified } = await import('unified')
  // We add the rootToAbsolute processor before usage because it depends on siteUrl.
  return convertHastToHtml(
    await unified()
      /*
         All images processed by Gatsby to be responsive are "unwrapped" into
         their fallback 'img' nodes, as RSS doesn't work with the tricks that
         true HTML does.
       */
      .use(unwrapImages)
      .use(rootToAbsolute, siteUrl)
      .run(htmlAst)
  )
}

module.exports = makeFeedHtml
