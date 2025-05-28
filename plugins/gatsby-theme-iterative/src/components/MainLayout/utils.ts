import { useEffect } from 'react'
import { useLocation } from '@gatsbyjs/reach-router'

import { handleFrontRedirect } from '../../utils/shared/redirects'

export const useRedirects = (): void => {
  const location = useLocation()

  useEffect(() => {
    handleFrontRedirect(location.host, location.pathname)
  }, [location])
}
