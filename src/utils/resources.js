import Promise from 'promise-polyfill'

const resourcesCache = {}
const resourceNodeCreators = {
  '\\.js$': ['script', { type: 'text/javascript' }, 'src'],
  '\\.css$': [
    'link',
    { rel: 'stylesheet', type: 'text/css', media: 'all' },
    'href'
  ]
}

export const loadResource = url => {
  if (!resourcesCache[url]) {
    resourcesCache[url] = new Promise((resolve, reject) => {
      const howToHandle = Object.keys(resourceNodeCreators).find(regExp =>
        new RegExp(regExp).test(url)
      )

      if (!howToHandle) {
        throw new Error(`You can't load resource with this url: ${url}`)
      }

      const [element, opts, urlProp] = resourceNodeCreators[howToHandle]
      const resourceNode = document.createElement(element)

      resourceNode.onload = resolve
      resourceNode.onerror = reject
      Object.keys(opts).forEach(opt => (resourceNode[opt] = opts[opt]))

      resourceNode[urlProp] = url
      document.head.appendChild(resourceNode)
    })
  }

  return resourcesCache[url]
}
