import { ReactNode } from 'react'
import { ScreenSize } from './getShowOnClass'

export type PopupName = 'CommunityPopup' | 'OtherToolsPopup'

interface INavLinkCommonData {
  showOn?: ScreenSize
}

export interface INavLinkData extends INavLinkCommonData {
  href: string
  eventType: string
  text: string
}

export interface INavLinkPopupData extends INavLinkCommonData {
  popup: PopupName
  text: string | ReactNode
}
