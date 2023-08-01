import React from 'react'
import cn from 'classnames'

import { ReactComponent as ArrowRight } from '../../../../static/img/arrow-right-black.svg'
import { ReactComponent as ArrowDown } from '../../../../static/img/arrow-down-white.svg'
import { ReactComponent as StarGithub } from '../../../../static/img/landing/star-github.svg'

import * as styles from './styles.module.css'
import shortenNumber from '../../../utils/format'
import useStars from '../../../gatsby/hooks/stars'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { navigate } from 'gatsby'

interface ISectionProps {
  className?: string
  children?: React.ReactNode
}

const SectionWrapper = ({ className, children }: ISectionProps) => (
  <div className={cn('w-full flex', className)}>{children}</div>
)

const Section = ({ className, children }: ISectionProps) => (
  <div
    className={cn(
      'w-1/2 px-6 py-10',
      'flex flex-col items-center justify-center gap-8',
      'text-center',
      className
    )}
  >
    {children}
  </div>
)

const Badge = ({ className, children }: ISectionProps) => (
  <div
    className={cn(
      'px-1.5 md:px-3 py-0 rounded-lg',
      'w-fit',
      'mx-auto',
      'flex items-center justify-center gap-2',
      'text-xl font-medium',
      className
    )}
  >
    {children}
  </div>
)

export const CTAButton = ({
  className,
  children,
  onClick
}: ISectionProps & {
  onClick?: () => void
}) => (
  <button
    className={cn(
      'rounded-lg',
      'py-1 px-2',
      'md:py-4 md:px-5',
      'text-base font-medium ',
      'md:text-xl',
      'flex items-center',
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
)

const HeroSection = () => {
  const stars = useStars()

  return (
    <>
      {/* Title Section */}
      <SectionWrapper>
        <Section className="bg-dark text-light">
          <img src={'/img/logos/dvcx.svg'} alt="DVCx Logo" />
          <div
            className={cn('flex flex-col gap-4', 'lg:flex-row lg:items-center')}
          >
            <h2 className="text-3xl font-medium">Dataset versioning</h2>
            <Badge className="bg-light text-dark">Coming soon</Badge>
          </div>
        </Section>
        <Section className="bg-light">
          <img src={'/img/logos/dvc.svg'} alt="DVC Logo" />
          <div
            className={cn('flex flex-col gap-4', 'lg:flex-row lg:items-center')}
          >
            <h2 className="text-3xl font-medium">ML model versioning</h2>
            <Link
              href="https://github.com/iterative/dvc"
              className="no-underline"
            >
              <Badge className="bg-dark text-light">
                {stars && shortenNumber(stars, 1)}
                <StarGithub />
              </Badge>
            </Link>
          </div>
        </Section>
      </SectionWrapper>
      {/* Visualization Section */}
      <SectionWrapper className={styles.sectionViz}>
        <div className={cn(styles.centered, styles.gridContainer)}>
          <img
            src={'/img/landing/Hero Visualization.svg'}
            className={styles.heroViz}
            alt="Visualization"
          />
          <div className={cn(styles.heroDesc, styles.dvcxDesc)}>
            <strong>Explore</strong> and <strong>enrich</strong> annotated
            datasets with custom embeddings, auto-labeling, and bias removal at
            billion-file scale — without modifying your data.
          </div>

          <div className={cn(styles.heroDesc, styles.dvcDesc)}>
            <strong>Connect</strong> to versioned data sources and code with
            pipelines, <strong>track</strong> experiments,{' '}
            <strong>register</strong> models — all based on GitOps principles.
          </div>
        </div>
        <Section className="bg-dark text-light" />
        <Section className="bg-light text-dark" />
      </SectionWrapper>

      {/* CTA Section */}

      <SectionWrapper>
        <Section className="bg-dark text-light pt-1">
          <CTAButton className="bg-light text-dark">
            Get on the waitlist
            <ArrowRight className="ml-4" />
          </CTAButton>
        </Section>
        <Section className="bg-light text-dark pt-1">
          <CTAButton
            className="bg-dark text-light"
            onClick={() => {
              navigate('#get-started-dvc')
            }}
          >
            Download it now
            <ArrowDown className="ml-4" />
          </CTAButton>
        </Section>
      </SectionWrapper>
    </>
  )
}

export default HeroSection
