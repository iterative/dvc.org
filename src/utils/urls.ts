import { navigate } from 'gatsby'

export function isExternalLink(url: string) {
  return /^https?:\/\//.test(url)
}

export const navigateLink = (link: string) => {
  if (isExternalLink(link)) {
    return window.open(link, `_blank`, `noreferrer`)
  } else {
    navigate(link)
  }
}
