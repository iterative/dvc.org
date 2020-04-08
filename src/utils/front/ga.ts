declare global {
  interface IGaEvent {
    hitType: 'event'
    eventCategory: string
    eventAction: string
    eventLabel?: string
  }

  interface IGaException {
    hitType: 'exception'
    exDescription: string
    exFatal: boolean
  }

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    ga: (command: 'send', data: IGaEvent | IGaException) => void
  }
}

export const logEvent = (
  eventCategory: string,
  eventAction: string,
  eventLabel?: string
): void => {
  if (!window.ga) return

  window.ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel
  })
}

export const logException = (exDescription = '', exFatal = false): void => {
  if (!window.ga) return

  if (exDescription) {
    window.ga('send', {
      hitType: 'exception',
      exDescription,
      exFatal
    })
  }
}
