import { blogsURL, homePageLink } from '@/constants/internalLinks'
import { MAIN_SITE_URL } from '@dvcorg/gatsby-theme/consts'

import { ReactComponent as EllipsisIcon } from '../../../../static/img/ellipsis.svg'
import {
  INavLinkData,
  INavLinkPopupData
} from '../components/LayoutHeader/Nav/LinkItems'
import {
  CommunityPopup,
  OtherPopup
} from '../components/LayoutHeader/Nav/Popup'

import * as styles from './styles.module.css'

interface ICommunityData {
  title: string
  text: string
  href: string
  img: string
  imgAlt: string
}

interface IMenuData {
  community: Array<ICommunityData>
  nav: Array<INavLinkData | INavLinkPopupData>
}

const menuData: IMenuData = {
  nav: [
    {
      href: '/use-cases',
      eventType: 'use-cases',
      text: 'Use Cases'
    },
    {
      href: homePageLink,
      eventType: 'doc',
      text: 'Doc'
    },
    {
      href: blogsURL,
      eventType: 'blog',
      text: 'Blog'
    },
    {
      href: 'https://learn.dvc.org/',
      eventType: 'course',
      text: 'Course'
    },
    {
      text: 'Community',
      Popup: CommunityPopup,
      href: `${MAIN_SITE_URL}/community`,
      popupName: 'communityPopup'
    },
    {
      href: `${MAIN_SITE_URL}/support`,
      eventType: 'support',
      text: 'Support'
    },
    {
      text: EllipsisIcon,
      ariaLabel: 'Show options',
      popupName: 'otherPopup',
      Popup: OtherPopup,
      className: styles.other,
      hideDropdown: true
    }
  ],
  community: [
    {
      title: 'Meet Us',
      text: 'Meet the Community',
      href: `${MAIN_SITE_URL}/community`,
      img: '/img/community/icon-community.svg',
      imgAlt: ''
    },
    {
      title: 'Testimonials',
      text: '',
      href: `${MAIN_SITE_URL}/community#testimonial`,
      img: '/img/community/icon-community.svg',
      imgAlt: ''
    },
    {
      title: 'Contribute',
      text: '',
      href: `${MAIN_SITE_URL}/community#contribute`,
      img: '/img/community/icon-contribute.svg',
      imgAlt: ''
    },
    {
      title: 'Learn',
      text: '',
      href: `${MAIN_SITE_URL}/community#learn`,
      img: '/img/community/icon-learn.svg',
      imgAlt: ''
    },
    {
      title: 'Events',
      text: '',
      href: `${MAIN_SITE_URL}/community#events`,
      img: '/img/community/icon-events.svg',
      imgAlt: ''
    }
  ]
}

export default menuData
