import { getFirstPage } from '../utils/shared/sidebar'
import {
  INavLinkData,
  INavLinkPopupData
} from '../components/LayoutHeader/Nav/LinkItems/types'

const docsPage = getFirstPage()

const navLinkItemsData: Array<INavLinkData | INavLinkPopupData> = [
  {
    href: docsPage,
    eventType: 'doc',
    text: 'Doc'
  },
  {
    text: 'Other Tools',
    popup: 'OtherToolsPopup'
  }
]

export default navLinkItemsData
