import { useState } from 'react'

type useNavPopupsHelpers = {
  onCommunityButtonClick: () => void
  onOtherToolsButtonClick: () => void
  isOtherToolsPopupOpen: boolean
  isCommunityPopupOpen: boolean
}

const togglePopup = (
  closeOtherPopups: () => void,
  isSelectedPopupOpen: boolean,
  openSelectedPopup: () => void,
  closeAllPopups: () => void
): void => {
  closeOtherPopups()
  if (isSelectedPopupOpen) {
    closeAllPopups()
  } else {
    openSelectedPopup()
  }
}

const closePopupsOnEscKeyPress = (
  key: string,
  closeAllPopups: () => void
): void => {
  if (key === 'Escape') {
    closeAllPopups()
  }
}

const setupPopupEventListeners = (
  handlePageClick: (event: MouseEvent) => void,
  handlePageKeyup: (event: KeyboardEvent) => void
): {
  closePageEvent: () => void
  closeKeyupEvent: () => void
} => {
  document.addEventListener('click', handlePageClick)
  document.addEventListener('keyup', handlePageKeyup)

  const closePageEvent = (): void =>
    document.removeEventListener('click', handlePageClick)
  const closeKeyupEvent = (): void =>
    document.removeEventListener('keyup', handlePageKeyup)

  return {
    closePageEvent,
    closeKeyupEvent
  }
}

const closePopupsOnOutsideClick = (
  popups: Array<HTMLLIElement | null>,
  event: MouseEvent,
  closeAllPopups: () => void
): void => {
  if (popups.some(popup => !popup)) {
    return
  }
  if (popups.every(popup => !popup?.contains(event.target as Node))) {
    closeAllPopups()
  }
}

export const useNavPopups: (
  communityPopupContainerEl: { current: HTMLLIElement | null },
  otherToolsPopupContainerEl: { current: HTMLLIElement | null }
) => useNavPopupsHelpers = (
  communityPopupContainerEl,
  otherToolsPopupContainerEl
) => {
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false)
  const [isOtherToolsPopupOpen, setIsOtherToolsPopupOpen] = useState(false)
  let pageCloseEventListener: () => void = () => null
  let keyupCloseEventListener: () => void = () => null

  const closeAllPopups = (): void => {
    setIsCommunityPopupOpen(false)
    setIsOtherToolsPopupOpen(false)

    pageCloseEventListener()
    keyupCloseEventListener()
  }

  const handlePageClick = (event: MouseEvent): void => {
    closePopupsOnOutsideClick(
      [communityPopupContainerEl.current, otherToolsPopupContainerEl.current],
      event,
      closeAllPopups
    )
  }

  const handlePageKeyup = (event: KeyboardEvent): void => {
    closePopupsOnEscKeyPress(event.key, closeAllPopups)
  }

  const setupNavPopupEventListeners = (): void => {
    const { closePageEvent, closeKeyupEvent } = setupPopupEventListeners(
      handlePageClick,
      handlePageKeyup
    )
    pageCloseEventListener = closePageEvent
    keyupCloseEventListener = closeKeyupEvent
  }

  const onCommunityButtonClick = (): void =>
    togglePopup(
      (): void => setIsOtherToolsPopupOpen(false),
      isCommunityPopupOpen,
      (): void => {
        setupNavPopupEventListeners()
        setIsCommunityPopupOpen(true)
      },
      closeAllPopups
    )

  const onOtherToolsButtonClick = (): void =>
    togglePopup(
      (): void => setIsCommunityPopupOpen(false),
      isOtherToolsPopupOpen,
      (): void => {
        setupNavPopupEventListeners()
        setIsOtherToolsPopupOpen(true)
      },
      closeAllPopups
    )

  return {
    onCommunityButtonClick,
    onOtherToolsButtonClick,
    isOtherToolsPopupOpen,
    isCommunityPopupOpen
  }
}
