import { RefObject, useEffect } from 'react'

const events = [`mousedown`, `touchstart`]

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClickOutside: (event: Event) => void,
  cleanup = true
) => {
  const isOutside = (element: Node | null) =>
    !ref.current || !ref.current.contains(element)

  const onClick = (event: Event) => {
    if (isOutside(event.target as Node)) {
      onClickOutside(event)
      if (cleanup) {
        for (const event of events) document.removeEventListener(event, onClick)
      }
    }
  }

  useEffect(() => {
    for (const event of events) {
      document.addEventListener(event, onClick)
    }

    return () => {
      for (const event of events) document.removeEventListener(event, onClick)
    }
  }, [ref, onClickOutside])
}
export default useOnClickOutside
