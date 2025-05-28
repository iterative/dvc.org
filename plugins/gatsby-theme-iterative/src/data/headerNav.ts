import {
  INavLinkData,
  INavLinkPopupData
} from '../components/LayoutHeader/Nav/LinkItems/types'
import { getFirstPage } from '../utils/shared/sidebar'

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
