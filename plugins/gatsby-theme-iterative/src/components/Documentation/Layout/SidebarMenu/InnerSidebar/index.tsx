import React from 'react'
import includes from 'lodash/includes'
import * as styles from '../styles.module.css'
import { structure } from '../../../../../utils/shared/sidebar'
import SidebarMenuItem from '../Item'
import { SidebarItemClickHandler } from '..'

export interface IInnerSidebarProps {
  activePaths?: string[]
  onClick: SidebarItemClickHandler
}

const SidebarSections: React.FC<IInnerSidebarProps> = ({
  activePaths,
  onClick
}) => {
  return (
    <div className={styles.sections}>
      <div className={styles.sectionLinks}>
        {structure.map(item => (
          <SidebarMenuItem
            key={item.path}
            activePaths={
              activePaths && includes(activePaths, item.path)
                ? activePaths
                : undefined
            }
            onClick={onClick}
            {...item}
          />
        ))}
      </div>
    </div>
  )
}

export default SidebarSections
