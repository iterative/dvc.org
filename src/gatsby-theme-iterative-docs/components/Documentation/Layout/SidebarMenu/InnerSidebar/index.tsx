import React from 'react'
import BaseInnerSidebar, {
  IInnerSidebarProps
} from 'gatsby-theme-iterative-docs/src/components/Documentation/Layout/SidebarMenu/InnerSidebar'
import * as styles from 'gatsby-theme-iterative-docs/src/components/Documentation/Layout/SidebarMenu/styles.module.css'
import ShowOnly from 'gatsby-theme-iterative-docs/src/components/ShowOnly'
import DownloadButton from '../../../../../../components/DownloadButton'

const InnerSidebar: React.FC<IInnerSidebarProps> = ({
  activePaths,
  onClick
}) => {
  return (
    <>
      <BaseInnerSidebar activePaths={activePaths} onClick={onClick} />
      <ShowOnly on="desktop">
        <div className={styles.footer}>
          <DownloadButton openTop />
        </div>
      </ShowOnly>
    </>
  )
}

export default InnerSidebar
