import { useState, useRef, RefObject } from 'react'

import useOnClickOutside from './useOnClickOutside'
import useOnEscape from './useOnEscape'

export interface IUsePopupReturn {
  toggle: () => void
  open: () => void
  close: () => void
  containerEl: RefObject<HTMLLIElement>
  isOpen: boolean
}

const usePopup = (): IUsePopupReturn => {
  const [isOpen, setIsOpen] = useState(false)
  const containerEl = useRef<HTMLLIElement>(null)

  const close = (): void => {
    setIsOpen(false)
  }

  useOnClickOutside(containerEl, close)
  useOnEscape(close)

  const open = (): void => {
    setIsOpen(true)
  }

  const toggle = (): void => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  return { toggle, containerEl, isOpen, open, close }
}

export default usePopup
