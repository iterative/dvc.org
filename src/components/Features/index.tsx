import React from 'react'

import PageContent from '../PageContent'
import LayoutWidthContainer from '../LayoutWidthContainer'
import HeroSection from '../HeroSection'
import Link from '../Link'
import PromoSection from '../PromoSection'

import styles from './styles.module.css'

const FeaturesPage: React.FC = () => (
  <>
    <PageContent>
      <HeroSection className={styles.heroContainer}>
        <h1 className={styles.heroHeading}>
          DVC brings agility, reproducibility, and collaboration into your
          existing data science workflow
        </h1>
      </HeroSection>
      <LayoutWidthContainer>
        <div className={styles.features}>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/git-icon.svg"
              alt="Git compatible"
            />
            <h3 className={styles.featureName}>Git-compatible</h3>
            <div className={styles.featureDescription}>
              DVC runs on top of any Git repository and is compatible with any
              standard Git server or provider (GitHub, GitLab, etc). Data file
              contents can be shared by network-accessible storage or any
              supported cloud solution. DVC offers all the advantages of a
              distributed version control system — lock-free, local branching,
              and versioning.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/storage-icon.svg"
              alt="Storage agnostic"
            />
            <h3 className={styles.featureName}>Storage agnostic</h3>
            <div className={styles.featureDescription}>
              Use Amazon S3, Microsoft Azure Blob Storage, Google Drive, Google
              Cloud Storage, Aliyun OSS, SSH/SFTP, HDFS, HTTP, network-attached
              storage, or disc to store data. The list of supported remote
              storage is constantly expanding.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/repro.svg"
              alt="Reproducibility"
            />
            <h3 className={styles.featureName}>Reproducible</h3>
            <div className={styles.featureDescription}>
              The single &#39;dvc repro&#39; command reproduces experiments
              end-to-end. DVC guarantees reproducibility by consistently
              maintaining a combination of input data, configuration, and the
              code that was initially used to run an experiment.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/branching.svg"
              alt="Low-friction branching"
            />
            <h3 className={styles.featureName}>Low friction branching</h3>
            <div className={styles.featureDescription}>
              DVC fully supports instantaneous Git branching, even with large
              files. Branches beautifully reflect the non-linear structure and
              highly iterative nature of a ML process. Data is not duplicated —
              one file version can belong to dozens of experiments. Create as
              many experiments as you want, instantaneously switch back and
              forth, and save a history of all attempts.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/storage-icon.svg"
              alt=""
            />
            <h3 className={styles.featureName}>Metric tracking</h3>
            <div className={styles.featureDescription}>
              Metrics are first-class citizens in DVC. DVC includes a command to
              list all branches, along with metric values, to track the progress
              or pick the best version.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/ml-pipe.svg"
              alt="ML pipelines framework"
            />
            <h3 className={styles.featureName}>ML pipeline framework</h3>
            <div className={styles.featureDescription}>
              DVC has a built-in way to connect ML steps into a DAG and run the
              full pipeline end-to-end. DVC handles caching of intermediate
              results and does not run a step again if input data or code are
              the same.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/languages-icon.svg"
              alt="Language & framework agnostic"
            />
            <h3 className={styles.featureName}>
              Language- & framework-agnostic
            </h3>
            <div className={styles.featureDescription}>
              No matter which programming language or libraries are in use or
              how code is structured, reproducibility and pipelines are based on
              input and output files or directories. Python, R, Julia, Scala
              Spark, custom binary, Notebooks, flatfiles/TensorFlow, PyTorch,
              etc. are all supported.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/cluster.svg"
              alt="HDFS, Hive & Apache Spark"
            />
            <h3 className={styles.featureName}>HDFS, Hive & Apache Spark</h3>
            <div className={styles.featureDescription}>
              Include Spark and Hive jobs in the DVC data versioning cycle along
              with local ML modeling steps or manage Spark and Hive jobs with
              DVC end-to-end. Drastically decrease a feedback loop by
              decomposing a heavy cluster job into smaller DVC pipeline steps.
              Iterate on the steps independently with respect to dependencies.
            </div>
          </div>
          <div className={styles.feature}>
            <img
              className={styles.featureIcon}
              src="/img/features/icons/failures.svg"
              alt="Failure tracking"
            />
            <h3 className={styles.featureName}>Track failures</h3>
            <div className={styles.featureDescription}>
              Bad ideas can sometimes spark more ideas among colleagues than
              successful ones. Retaining knowledge of failed attempts can save
              time in the future. DVC is built to track everything in a
              reproducible and easily accessible way.
            </div>
          </div>
        </div>
      </LayoutWidthContainer>
    </PageContent>
    <PromoSection
      title="Ready to give it a try?"
      buttons={[
        <Link href="/doc/start" key="get-started">
          Get Started
        </Link>
      ]}
    />
  </>
)

export default FeaturesPage
