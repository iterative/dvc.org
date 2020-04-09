const visit = require('unist-util-visit')
const { selectAll } = require('hast-util-select')
const escape = require('escape-html')

const { convertHastToHtml, convertHtmlToHast } = require('../utils/convertHast')

const requiredExternalLinkAttrs = ['href', 'title', 'description', 'link']

function isCorrectExternalLinkAttr(attrsKeyTagArray) {
  return requiredExternalLinkAttrs.every(attr =>
    attrsKeyTagArray.includes(attr)
  )
}

function renderTag(attrs) {
  return `
    <section class="elp-content-holder">
      <a href="${escape(attrs.href)}" class="external-link-preview">
          <div class="elp-description-holder">
            <h4 class="elp-title">${escape(attrs.title)}</h4>
            <div class="elp-description">${escape(attrs.description)}</div>
            <div class="elp-link">${escape(attrs.link)}</div>
          </div>
           ${
             attrs.image
               ? `<div class="elp-image-holder">
                <img src="${escape(attrs.image)}" alt="${escape(attrs.title)}"/>
            </div>`
               : ``
           }
      </a>
    </section>
    `
}

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'html', node => {
    const hast = convertHtmlToHast(node.value)
    const externalLinkNodeList = selectAll('external-link', hast)

    if (!externalLinkNodeList.length) {
      return
    }

    externalLinkNodeList.forEach(externalLinkNode => {
      const { properties } = externalLinkNode
      if (isCorrectExternalLinkAttr(Object.keys(properties))) {
        const externalLinkHtml = renderTag(properties)
        const externalLinkHast = convertHtmlToHast(externalLinkHtml)

        externalLinkNode.type = externalLinkHast.type
        externalLinkNode.tagName = externalLinkHast.tagName
        externalLinkNode.properties = externalLinkHast.properties
        externalLinkNode.children = externalLinkHast.children
      } else {
        throw new Error(
          `No correct tag <external-link /> or not all nested tags in ${node.value}`
        )
      }
    })

    node.value = convertHastToHtml(hast)
  })
}
