import React from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

import * as styles from './styles.module.css'

interface IHeroSectionProps {
  className?: string
  children: React.ReactNode
}

const HeroSection: React.FC<IHeroSectionProps> = ({ className, children }) => (
  <div className={cn(styles.heroSection, className)}>
    <LayoutWidthContainer>{children}</LayoutWidthContainer>
  </div>
)

export default HeroSection
