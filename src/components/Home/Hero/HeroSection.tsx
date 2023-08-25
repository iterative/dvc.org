import React, { ButtonHTMLAttributes } from 'react'
import cn from 'classnames'

import { ReactComponent as ArrowDown } from '../../../../static/img/arrow-down-white.svg'

import * as styles from './styles.module.css'
import shortenNumber from '../../../utils/format'
import useStars from '../../../gatsby/hooks/stars'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { navigate } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

interface ISectionProps {
  className?: string
  leftClassName?: string
  rightClassName?: string
  children?: React.ReactNode
}

const SectionWrapper = ({
  className,
  leftClassName,
  rightClassName,
  children,
  maxWidth = 'lg'
}: ISectionProps & {
  maxWidth?: 'lg' | 'xl' | '2xl'
}) => (
  <div className={cn('w-full flex relative', className)}>
    <div className="absolute w-full h-full flex flex-row">
      <div className={cn('w-1/2 h-full', leftClassName)} />
      <div className={cn('w-1/2 h-full', rightClassName)} />
    </div>
    <div
      className={cn('w-full z-10 flex m-auto', {
        'max-w-screen-lg': maxWidth === 'lg',
        'max-w-screen-xl': maxWidth === 'xl',
        'max-w-screen-2xl': maxWidth === '2xl'
      })}
    >
      {children}
    </div>
  </div>
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
  ...props
}: ISectionProps & ButtonHTMLAttributes<HTMLButtonElement>) => (
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
    {...props}
  >
    {children}
  </button>
)

const HeroSection = () => {
  const stars = useStars()

  return (
    <div className="md:border-y-2 md:border-solid md:border-y-light">
      {/* Title Section */}
      <SectionWrapper>
        <Section>
          <StaticImage
            src="../../../../static/img/logos/dvcx.svg"
            alt="DVCx Logo"
            className="max-w-[210px]"
          />
          <div
            className={cn('flex flex-col gap-4', 'lg:flex-row lg:items-center')}
          >
            <h2 className="text-3xl font-medium">Dataset versioning</h2>
            <Badge className="bg-dark text-light">Coming soon</Badge>
          </div>
        </Section>
        <Section>
          <StaticImage
            src="../../../../static/img/logos/dvc.svg"
            alt="DVC Logo"
            className="max-w-[210px]"
          />
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
                <StaticImage
                  src="../../../../static/img/landing/star-github.svg"
                  alt="Star Github"
                />
              </Badge>
            </Link>
          </div>
        </Section>
      </SectionWrapper>
      {/* Visualization Section */}
      <SectionWrapper maxWidth="2xl">
        <div className={cn(styles.gridContainer)}>
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
      </SectionWrapper>

      {/* CTA Section */}

      <SectionWrapper>
        <Section>
          <CTAButton
            className="bg-dark text-light"
            onClick={() => {
              navigate('#get-started-dvcx', { state: { focusInput: true } })
            }}
          >
            Download it now
            <ArrowDown className="ml-4" />
          </CTAButton>
        </Section>
        <Section>
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
    </div>
  )
}

export default HeroSection
