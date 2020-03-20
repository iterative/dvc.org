import Promise from 'promise-polyfill'

export const getImagesUrls = node =>
  Array.from(node.querySelectorAll('img')).map(img => img.src)

export const imageLoaded = url =>
  new Promise(resolve => {
    let img = new Image()

    img.addEventListener('load', function onLoad() {
      resolve()
      img.removeEventListener('load', onLoad)
      img = null
    })
    img.addEventListener('error', function onError() {
      resolve()
      img.removeEventListener('error', onError)
      img = null
    })
    img.src = url
  })

export const allImagesLoaded = urls => Promise.all(urls.map(imageLoaded))

export const allImagesLoadedInContainer = node =>
  allImagesLoaded(getImagesUrls(node))
