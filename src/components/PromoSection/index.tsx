import React, { cloneElement } from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '../LayoutWidthContainer'

import styles from './styles.module.css'

interface IPromoSectionProps {
  title: string
  buttons: Array<React.ReactElement>
}

const PromoSection: React.FC<IPromoSectionProps> = ({ title, buttons }) => (
  <section className={styles.container}>
    <LayoutWidthContainer>
      <img
        className={cn(styles.bgGlyph, styles.topLeft)}
        src="/img/glyph-3.svg"
        alt=""
      />
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.buttonsContainer}>
        {buttons.map((button, index) =>
          cloneElement(button, {
            className: cn(
              button.props.className,
              styles.button,
              index === 0 && styles.first
            )
          })
        )}
      </div>
      <img
        className={cn(styles.bgGlyph, styles.rightBottom)}
        src="/img/glyph-4.svg"
        alt=""
      />
    </LayoutWidthContainer>
  </section>
)

export default PromoSection
