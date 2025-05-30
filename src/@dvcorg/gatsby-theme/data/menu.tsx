import { blogsPageLink } from '@/constants/internalLinks'
import { getFirstPage } from '@dvcorg/gatsby-theme/src/utils/shared/sidebar'

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

const docsPage = getFirstPage()

const menuData: IMenuData = {
  nav: [
    {
      href: '/doc/use-cases',
      eventType: 'use-cases',
      text: 'Use Cases'
    },
    {
      href: docsPage,
      eventType: 'doc',
      text: 'Doc'
    },
    {
      href: blogsPageLink,
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
      href: '/community',
      popupName: 'communityPopup'
    },
    {
      href: '/support',
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
      href: '/community',
      img: '/img/community/icon-community.svg',
      imgAlt: ''
    },
    {
      title: 'Testimonials',
      text: '',
      href: '/community#testimonial',
      img: '/img/community/icon-community.svg',
      imgAlt: ''
    },
    {
      title: 'Contribute',
      text: '',
      href: '/community#contribute',
      img: '/img/community/icon-contribute.svg',
      imgAlt: ''
    },
    {
      title: 'Learn',
      text: '',
      href: '/community#learn',
      img: '/img/community/icon-learn.svg',
      imgAlt: ''
    },
    {
      title: 'Events',
      text: '',
      href: '/community#events',
      img: '/img/community/icon-events.svg',
      imgAlt: ''
    }
  ]
}

export default menuData
