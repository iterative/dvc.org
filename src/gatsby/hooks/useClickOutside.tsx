import { RefObject, useEffect } from 'react'

const events = [`mousedown`, `touchstart`]

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClickOutside: (event: Event) => void
) => {
  const isOutside = (element: Node | null) =>
    !ref.current || !ref.current.contains(element)

  const onClick = (event: Event) => {
    if (isOutside(event.target as Node)) {
      onClickOutside(event)
    }
  }

  useEffect(() => {
    for (const event of events) {
      document.addEventListener(event, onClick)
    }

    return () => {
      for (const event of events) document.removeEventListener(event, onClick)
    }
  })
}
export default useClickOutside
