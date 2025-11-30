import { externalUrls } from '../consts'

const getEditLink = (sourcePath: string): string =>
  `${externalUrls.dvcRepo}/blob/main/content${sourcePath}`
export default getEditLink
