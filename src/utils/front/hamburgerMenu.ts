import {
  useEffect,
  useState,
  useCallback,
  MouseEvent,
  KeyboardEvent
} from 'react'
import styles from '../../components/HamburgerMenu/styles.module.css'
import { logEvent } from '../../utils/front/ga'

export type HamburgerHelpers = {
  opened: boolean
  setOpened: (newState: boolean) => void
  handleToggle: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleClose: () => void
  handleItemClick: (name: string) => (e: MouseEvent) => void
}

export const useHamburgerMenu: () => HamburgerHelpers = () => {
  const [opened, setOpened] = useState(false)

  const handleToggle = useCallback(() => setOpened(!opened), [opened])
  const handleKeyDown = useCallback(e => {
    if (e.which === 13) {
      handleToggle()
    }
  }, [])

  const handleClose = useCallback(() => setOpened(false), [opened])
  const handleItemClick = useCallback(
    item => (): void => {
      close()
      logEvent('hamburger', item)
    },
    []
  )

  useEffect(() => {
    const method = opened ? 'add' : 'remove'
    document.body.classList[method](styles.hiddenScrollbar)
  }, [opened])

  return {
    opened,
    setOpened,
    handleToggle,
    handleKeyDown,
    handleClose,
    handleItemClick
  }
}
