import { useEffect } from 'react'
import { useLocation } from '@reach/router'

import { handleFrontRedirect } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/redirects'
import {
  scrollIntoLayout,
  getScrollNode
} from '@dvcorg/gatsby-theme-iterative/src/utils/front/scroll'
import safeQuerySelector from '@dvcorg/gatsby-theme-iterative/src/utils/front/safeQuerySelector'

import * as styles from './styles.module.css'

export const useAnchorNavigation = (): void => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = safeQuerySelector(location.hash)

      if (node) {
        scrollIntoLayout(node, { waitImages: true })
      }
    } else {
      getScrollNode().scrollTop = 0
    }
  }, [location.href])
}

export const useRedirects = (): void => {
  const location = useLocation()

  useEffect(() => {
    handleFrontRedirect(location.host, location.pathname)
  }, [location.href])
}

export const useSmoothScroll = (enable: boolean): void => {
  useEffect(() => {
    const method = enable ? 'add' : 'remove'

    document.body.classList[method](styles.smoothScrolling)
  }, [enable])
}
