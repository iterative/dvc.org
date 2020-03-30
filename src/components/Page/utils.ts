import { useEffect } from 'react'
import { useLocation } from '@reach/router'

import { handleFrontRedirect } from '../../utils/redirects'
import { allImagesLoadedInContainer } from '../../utils/images'

export const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)
      const headerHeight = document.getElementById('header')?.clientHeight || 0

      if (node) {
        allImagesLoadedInContainer(document.body).then(() => {
          node.scrollIntoView()
          document.documentElement.scrollBy(0, -headerHeight)
        })
      }
    } else {
      document.documentElement.scrollTop = 0
    }
  }, [location.href])
}

export const useRedirects = () => {
  const location = useLocation()

  useEffect(() => {
    handleFrontRedirect(location.host, location.pathname)
  }, [location.href])
}

export const useSmoothScroll = (enable: boolean) => {
  useEffect(() => {
    const method = enable ? 'add' : 'remove'

    document.body.classList[method]('bodySmoothScrolling')
  }, [enable])
}
