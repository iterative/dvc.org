import React from 'react'
import cn from 'classnames'

import SubscribeForm from './Form'
import { default as Glyph1Src } from './glyph-1.svg'
import { default as Glyph2Src } from './glyph-2.svg'

import styles from './styles.module.css'

const SubscribeSection: React.FC = () => (
  <div className={styles.wrapper} id="subscribe">
    <img src={Glyph1Src} className={cn(styles.glyph, styles.topleft)} alt="" />
    <div className={styles.container}>
      <div className={styles.title}>
        Subscribe for updates. We won&#39;t spam you.
      </div>
      <div className={styles.subscribeContainer}>
        <SubscribeForm />
      </div>
    </div>
    <img
      src={Glyph2Src}
      className={cn(styles.glyph, styles.rigthbottom)}
      alt=""
    />
  </div>
)

export default SubscribeSection
