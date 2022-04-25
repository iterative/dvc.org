import { useEffect } from 'react'

const useOnEscape = (handler: (event: Event) => void, cleanUp = true) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event)
        if (cleanUp) document.removeEventListener('keyup', listener)
      }
    }

    document.addEventListener('keyup', listener)

    return () => {
      document.removeEventListener('keyup', listener)
    }
  }, [handler, cleanUp])
}
export default useOnEscape
