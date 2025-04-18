import { RefObject, useCallback, useEffect } from 'react'

const events = [`mousedown`, `touchstart`]

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClickOutside: (event: Event) => void,
  cleanup = true
) => {
  const onClick = useCallback(
    (event: Event) => {
      const isOutside = (element: Node | null) =>
        !ref.current || !ref.current.contains(element)

      if (isOutside(event.target as Node)) {
        onClickOutside(event)
        if (cleanup) {
          for (const event of events)
            document.removeEventListener(event, onClick)
        }
      }
    },
    [cleanup, onClickOutside, ref]
  )

  useEffect(() => {
    for (const event of events) {
      document.addEventListener(event, onClick)
    }

    return () => {
      for (const event of events) document.removeEventListener(event, onClick)
    }
  }, [ref, onClickOutside, onClick])
}
export default useOnClickOutside
