import cn from 'classnames'
import includes from 'lodash/includes'
import { useInView } from 'react-intersection-observer'

import {
  HamburgerMenu,
  HamburgerButton,
  useHamburgerMenu
} from '../HamburgerMenu'
import LayoutWidthContainer from '../LayoutWidthContainer'
import { LayoutModifiers, ILayoutModifiable } from '../MainLayout'

// import LayoutAlert from './Alert'
import { HeaderBranding } from './HeaderBranding'
import Nav from './Nav'
import * as styles from './styles.module.css'

const LayoutHeader: React.FC<ILayoutModifiable> = ({ modifiers }) => {
  const { ref, inView } = useInView({ rootMargin: '20px 0px 0px 0px' })
  const scrolled = !inView

  const { opened, handleToggle, handleItemClick } = useHamburgerMenu()
  const hasCollapsedModifier = includes(modifiers, LayoutModifiers.Collapsed)
  // const hasHideAlertModifier = includes(modifiers, LayoutModifiers.HideAlert)
  const collapsed = opened || hasCollapsedModifier || scrolled

  return (
    <>
      <div ref={ref} />
      <header
        id="header"
        data-collapsed={collapsed}
        className={cn(styles.headerContainer)}
      >
        {/* {!hasHideAlertModifier && LayoutAlert && ( */}
        {/*   <LayoutAlert collapsed={collapsed} /> */}
        {/* )} */}
        <LayoutWidthContainer
          className={cn(
            styles.header,
            'transition-all',
            'ease-in-out',
            'delay-150',
            'py-2',
            'px-3'
          )}
          wide
        >
          <HeaderBranding />
          <Nav />
          <HamburgerButton
            opened={opened}
            collapsed={collapsed}
            handleClick={handleToggle}
          />
          <HamburgerMenu
            opened={opened}
            collapsed={collapsed}
            handleToggle={handleToggle}
            handleItemClick={handleItemClick}
          />
        </LayoutWidthContainer>
      </header>
    </>
  )
}

export default LayoutHeader
