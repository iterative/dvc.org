import { useEffect } from 'react'
import { useLocation } from '@reach/router'

import { handleFrontRedirect } from '../../utils/redirects'
import { allImagesLoadedInContainer } from '../../utils/images'
import { scrollIntoLayout } from '../../utils/scroll'

import styles from './styles.module.css'

export const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)

      if (node) {
        scrollIntoLayout(node)
        allImagesLoadedInContainer(document.body).then(() =>
          scrollIntoLayout(node)
        )
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

    document.body.classList[method](styles.smoothScrolling)
  }, [enable])
}
