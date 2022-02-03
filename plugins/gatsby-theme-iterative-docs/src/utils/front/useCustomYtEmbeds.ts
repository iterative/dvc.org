import { useEffect } from 'react'

const setUpCustomYtEmbeds = () => {
  const ytEmbeds = document.querySelectorAll('.yt-embed-wrapper')
  const removeClickListeners: Array<() => void> = []

  ytEmbeds.forEach(embed => {
    const iframe = embed.querySelector('iframe')
    const overlay = embed.querySelector('.yt-embed-wrapper__overlay')
    const tooltip = embed.querySelector('.yt-embed-wrapper__tooltip')

    const handleOverlayClick = (event: MouseEvent) => {
      if (event.target === tooltip || tooltip?.contains(event.target as Node)) {
        return
      }
      if (iframe && iframe.src) {
        iframe.src = iframe?.src + `&autoplay=1`
      }
      overlay?.classList.add('hidden')
    }

    const removeListener = () => {
      overlay?.removeEventListener('click', handleOverlayClick as EventListener)
    }

    overlay?.addEventListener('click', handleOverlayClick as EventListener)

    removeClickListeners.push(removeListener)
  })

  return () => {
    removeClickListeners.forEach(rmListener => rmListener())
  }
}

const useCustomYtEmbeds = () => {
  useEffect(() => {
    const removeEventListeners = setUpCustomYtEmbeds()

    return () => {
      removeEventListeners()
    }
  }, [])
}

export default useCustomYtEmbeds
