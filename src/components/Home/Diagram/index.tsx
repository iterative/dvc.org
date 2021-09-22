import React, { forwardRef } from 'react'
import Slider from 'react-slick'
import cn from 'classnames'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link from '../../Link'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './styles.module.css'

const LearnMore: React.FC<{ href: string }> = ({ href }) => (
  <div className={styles.learnMoreContainer}>
    <Link className={styles.learnMoreLink} href={href}>
      <span>Learn&nbsp;more</span>
      <img
        className={styles.learnMoreLinkIcon}
        src="/img/learn_more_arrow.svg"
        alt=""
      />
    </Link>
  </div>
)

const ColumnOne: React.FC = () => (
  <div className={styles.column}>
    <h3 className={cn(styles.columnCaption, styles.purple)}>
      ML project version control
    </h3>
    <div className={styles.columnDescriptionContainer}>
      <p className={styles.columnDescription}>
        Version control machine learning models, data sets and intermediate
        files. DVC connects them with code, and uses Amazon S3, Microsoft Azure
        Blob Storage, Google Drive, Google Cloud Storage, Aliyun OSS, SSH/SFTP,
        HDFS, HTTP, network-attached storage, or disc to store file contents.
      </p>
      <p className={styles.columnDescription}>
        Full code and data provenance help track the complete evolution of every
        ML model. This guarantees reproducibility and makes it easy to switch
        back and forth between experiments.
      </p>
    </div>
    <LearnMore href={'/features'} />
  </div>
)

const ColumnTwo: React.FC = () => (
  <div className={styles.column}>
    <h3 className={cn(styles.columnCaption, styles.azure)}>
      ML experiment management
    </h3>
    <div className={styles.columnDescriptionContainer}>
      <p className={styles.columnDescription}>
        Harness the full power of Git branches to try different ideas instead of
        sloppy file suffixes and comments in code. Use automatic metric-tracking
        to navigate instead of paper and pencil.
      </p>
      <p className={styles.columnDescription}>
        DVC was designed to keep branching as simple and fast as in Git — no
        matter the data file size. Along with first-class citizen metrics and ML
        pipelines, it means that a project has cleaner structure. It&#39;s easy
        to compare ideas and pick the best. Iterations become faster with
        intermediate artifact caching.
      </p>
    </div>
    <LearnMore href={'/features'} />
  </div>
)

const ColumnThree: React.FC = () => (
  <div className={styles.column}>
    <h3 className={cn(styles.columnCaption, styles.orange)}>
      Deployment & Collaboration
    </h3>
    <div className={styles.columnDescriptionContainer}>
      <p className={styles.columnDescription}>
        Instead of ad-hoc scripts, use push/pull commands to move consistent
        bundles of ML models, data, and code into production, remote machines,
        or a colleague&#39;s computer.
      </p>
      <p className={styles.columnDescription}>
        DVC introduces lightweight pipelines as a first-class citizen mechanism
        in Git. They are language-agnostic and connect multiple steps into a
        DAG. These pipelines are used to remove friction from getting code into
        production.
      </p>
    </div>
    <LearnMore href={'/features'} />
  </div>
)

const DiagramSection: React.ForwardRefRenderFunction<HTMLElement> = (
  _,
  ref
) => (
  <section className={styles.diagramSection} ref={ref}>
    <LayoutWidthContainer>
      <h2 className={styles.title}>DVC tracks ML models and data sets</h2>
      <p className={styles.description}>
        DVC is built to make ML models shareable and reproducible. It is
        designed to handle large files, data sets, machine learning models, and
        metrics as well as code.
      </p>

      <ShowOnly on="desktop">
        <div className={styles.desktopChartContainer}>
          <img className={styles.desktopChart} src="/img/graphic.png" alt="" />
        </div>
        <div className={styles.columns}>
          <ColumnOne />
          <ColumnTwo />
          <ColumnThree />
        </div>
      </ShowOnly>

      <ShowOnly on="mobile">
        <div className={styles.sliderContainer}>
          <Slider
            slidesToShow={1}
            slidesToScroll={1}
            initialSlide={1}
            infinite
            speed={600}
            dots
            appendDots={(dots): JSX.Element => (
              <ul className={styles.sliderDots}>{dots}</ul>
            )}
          >
            <div className={styles.slide}>
              <img
                className={styles.slideImage}
                src="/img/experiments.png"
                alt="ML project version control"
              />
              <ColumnOne />
            </div>
            <div className={styles.slide}>
              <img
                className={styles.slideImage}
                src="/img/graph.png"
                alt="ML experiment management"
              />
              <ColumnTwo />
            </div>
            <div className={styles.slide}>
              <img
                className={styles.slideImage}
                src="/img/result.png"
                alt="Deployment & Collaboration"
              />
              <ColumnThree />
            </div>
          </Slider>
        </div>
      </ShowOnly>
    </LayoutWidthContainer>
  </section>
)

export default forwardRef<HTMLElement>(DiagramSection)
