import { useState, useRef, RefObject } from 'react'

export interface IUsePopupReturn {
  toggle: () => void
  close: () => void
  containerEl: RefObject<HTMLLIElement>
  isOpen: boolean
}

const usePopup = (): IUsePopupReturn => {
  const [isOpen, setIsOpen] = useState(false)
  const containerEl = useRef<HTMLLIElement>(null)
  let pageCloseEventListener: () => void = () => null
  let keyupCloseEventListener: () => void = () => null

  const close = (): void => {
    setIsOpen(false)

    pageCloseEventListener()
    keyupCloseEventListener()
  }

  const handlePageKeyup = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      close()
    }
  }

  const handlePageClick = (event: MouseEvent) => {
    if (!containerEl?.current?.contains(event.target as Node)) {
      close()
    }
  }

  const open = (): void => {
    setIsOpen(true)
    document.addEventListener('click', handlePageClick)
    document.addEventListener('keyup', handlePageKeyup)

    pageCloseEventListener = (): void =>
      document.removeEventListener('click', handlePageClick)
    keyupCloseEventListener = (): void =>
      document.removeEventListener('keyup', handlePageKeyup)
  }

  const toggle = (): void => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  return { toggle, containerEl, isOpen, close }
}

export default usePopup
