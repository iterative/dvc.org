const setUpCustomYtEmbeds = () => {
  const ytEmbeds = document.querySelectorAll('.yt-embed-wrapper')
  ytEmbeds.forEach(embed => {
    const iframe = embed.querySelector('iframe')
    const overlay = embed.querySelector('.yt-embed-wrapper__overlay')

    overlay?.addEventListener('click', () => {
      if (iframe && iframe.src) {
        iframe.src = iframe?.src + `&autoplay=1`
      }
      overlay.classList.add('hidden')
    })
  })
}

export default setUpCustomYtEmbeds
