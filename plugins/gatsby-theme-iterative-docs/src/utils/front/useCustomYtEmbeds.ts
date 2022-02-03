import { useEffect } from 'react'

const setUpCustomYtEmbeds = () => {
  const ytEmbeds = document.querySelectorAll('.yt-embed-wrapper')
  ytEmbeds.forEach(embed => {
    const iframe = embed.querySelector('iframe')
    const overlay = embed.querySelector('.yt-embed-wrapper__overlay')
    const tooltip = embed.querySelector('.yt-embed-wrapper__tooltip')

    overlay?.addEventListener('click', event => {
      if (event.target === tooltip || tooltip?.contains(event.target as Node)) {
        return
      }
      if (iframe && iframe.src) {
        iframe.src = iframe?.src + `&autoplay=1`
      }
      overlay.classList.add('hidden')
    })
  })
}

const useCustomYtEmbeds = () => {
  useEffect(() => {
    setUpCustomYtEmbeds()
  }, [])
}

export default useCustomYtEmbeds
