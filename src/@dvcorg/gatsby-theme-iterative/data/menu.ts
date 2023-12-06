import { getFirstPage } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/sidebar'

import * as styles from './styles.module.css'
import { ReactComponent as EllipsisIcon } from '../../../../static/img/ellipsis.svg'
import {
  OtherToolsPopup,
  CommunityPopup,
  OtherPopup
} from '../components/LayoutHeader/Nav/Popup'
import {
  INavLinkData,
  INavLinkPopupData
} from '../components/LayoutHeader/Nav/LinkItems'

interface ICommunityData {
  title: string
  text: string
  href: string
  img: string
  imgAlt: string
}

interface IProductsData {
  title: string
  titleImgClass?: string
  description: string
  iconClass: string | null
  href: string
  img: string
  imgAlt: string
  target?: '_blank'
}

interface IMenuData {
  community: Array<ICommunityData>
  products: Array<IProductsData>
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
      href: 'https://iterative.ai/blog/',
      eventType: 'blog',
      text: 'Blog'
    },
    {
      href: 'https://learn.iterative.ai/',
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
      text: 'Other Tools',
      popupName: 'otherToolsPopup',
      Popup: OtherToolsPopup
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
  ],
  products: [
    {
      title: 'DVC Studio',
      description: 'Track experiments and share insights from ML projects',
      iconClass: styles.studioIcon,
      href: 'https://studio.iterative.ai/',
      img: '/img/studio_icon-color--square_vector.svg',
      imgAlt: 'Studio logo'
    },
    {
      title: 'DVC',
      description: 'Open-source version control system for ML projects',
      iconClass: styles.dvcIcon,
      href: '/',
      img: '/img/dvc_icon-color--square_vector.svg',
      imgAlt: 'DVC logo'
    },
    {
      title: 'VS Code Extension',
      titleImgClass: styles.vscodeIcon,
      description: 'Local ML model development and experiment tracking',
      iconClass: null,
      href: 'https://marketplace.visualstudio.com/items?itemName=Iterative.dvc',
      img: '/img/dvc_icon-color--square_vector.svg',
      imgAlt: 'DVC logo'
    }
  ]
}

export default menuData
