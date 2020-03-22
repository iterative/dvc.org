import Promise from 'promise-polyfill'

export const getImages = node => Array.from(node.querySelectorAll('img'))

export const imageLoaded = imgNode => {
  if (imgNode.complete && imgNode.naturalWidth !== 0) {
    return Promise.resolve()
  }

  return new Promise(resolve => {
    imgNode.addEventListener('load', function onLoad() {
      resolve()
      imgNode.removeEventListener('load', onLoad)
    })
    imgNode.addEventListener('error', function onError() {
      resolve()
      imgNode.removeEventListener('error', onError)
    })
  })
}

export const allImagesLoaded = urls => Promise.all(urls.map(imageLoaded))

export const allImagesLoadedInContainer = node =>
  allImagesLoaded(getImages(node))
