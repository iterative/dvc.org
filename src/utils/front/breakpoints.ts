import { customMedia } from '../../../config/postcss/media'

type AvailableCustomMedia = keyof typeof customMedia

export const matchMedia = (media: string | AvailableCustomMedia): boolean => {
  if (media.startsWith('--') && Object.keys(customMedia).includes(media)) {
    media = customMedia[media as AvailableCustomMedia]
  }

  return window.matchMedia(media).matches
}
