export const logEvent = (eventCategory, eventAction, eventLabel) => {
  if (!window.ga) return

  window.ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel
  })
}

export const logException = (exDescription = '', exFatal = false) => {
  if (!window.ga) return

  if (exDescription) {
    window.ga('send', {
      hitType: 'exception',
      exDescription,
      exFatal
    })
  }
}
