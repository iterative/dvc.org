import cn from 'classnames'
import React from 'react'

import * as icons from './icons'
import styles from './styles.module.css'

interface IIconSetProps {
  className?: string
  name: string
}

const IconSet: React.FC<IIconSetProps> = ({
  className,
  name,
  ...iconProps
}) => (
  <div
    style={{
      backgroundImage: `url(${icons[name as keyof typeof icons]})`
    }}
    className={cn(styles.icon, className)}
    {...iconProps}
  />
)

export default IconSet
