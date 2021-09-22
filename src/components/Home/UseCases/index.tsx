import React, { forwardRef } from 'react'
import YoutubeVideo from './Video'
import CollapsibleText from './CollapsibleText'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'

import styles from './styles.module.css'

const Heading1: React.FC = () => (
  <div className={styles.caseHeader}>
    <img
      className={styles.caseIcon}
      src="/img/save-reprro.svg"
      width={30}
      height={30}
      alt=""
    />
    <h3 className={styles.caseTitle}>Save and reproduce your experiments</h3>
  </div>
)

const Heading2: React.FC = () => (
  <div className={styles.caseHeader}>
    <img
      className={styles.caseIcon}
      src="/img/git-icon.svg"
      width={30}
      height={30}
      alt=""
    />
    <h3 className={styles.caseTitle}>Version control models and data</h3>
  </div>
)

const Heading3: React.FC = () => (
  <div className={styles.caseHeader}>
    <img
      className={styles.caseIcon}
      src="/img/share.svg"
      width={30}
      height={31}
      alt=""
    />
    <h3 className={styles.caseTitle}>
      Establish workflow for deployment & collaboration
    </h3>
  </div>
)

const Description1: React.FC = () => (
  <div className={styles.caseDescription}>
    At any time, fetch the full context about any experiment you or your
    colleagues have run. DVC guarantees that all files and metrics will be
    consistent and in the right place to reproduce the experiment or use it as a
    baseline for a new iteration.
  </div>
)

const Description2: React.FC = () => (
  <div className={styles.caseDescription}>
    DVC keeps metafiles in Git instead of Google Docs to describe and version
    control your data sets and models. DVC supports a variety of external
    storage types as a remote cache for large files.
  </div>
)

const Description3: React.FC = () => (
  <div className={styles.caseDescription}>
    DVC defines rules and processes for working effectively and consistently as
    a team. It serves as a protocol for collaboration, sharing results, and
    getting and running a finished model in a production environment.
  </div>
)

const UseCases: React.ForwardRefRenderFunction<HTMLElement> = (_, ref) => {
  return (
    <section className={styles.container} ref={ref}>
      <LayoutWidthContainer>
        <h2 className={styles.heading}>Use cases</h2>
        <div className={styles.wrapper}>
          <div className={styles.videoContainer}>
            <YoutubeVideo id={`UbL7VUpv1Bs`} />
          </div>

          <div className={styles.rightColumn}>
            <ShowOnly on="desktop">
              <div className={styles.cases}>
                <div className={styles.case}>
                  <Heading1 />
                  <Description1 />
                </div>
                <div className={styles.case}>
                  <Heading2 />
                  <Description2 />
                </div>
                <div className={styles.case}>
                  <Heading3 />
                  <Description3 />
                </div>
              </div>
            </ShowOnly>

            <ShowOnly on="mobile">
              <div className={styles.cases}>
                <div className={styles.case}>
                  <CollapsibleText header={<Heading1 />}>
                    <Description1 />
                  </CollapsibleText>
                </div>
                <div className={styles.case}>
                  <CollapsibleText header={<Heading2 />}>
                    <Description2 />
                  </CollapsibleText>
                </div>
                <div className={styles.case}>
                  <CollapsibleText header={<Heading3 />}>
                    <Description3 />
                  </CollapsibleText>
                </div>
              </div>
            </ShowOnly>
          </div>
        </div>
      </LayoutWidthContainer>
    </section>
  )
}

export default forwardRef<HTMLElement>(UseCases)
