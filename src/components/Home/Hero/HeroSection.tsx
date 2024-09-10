import React, { ButtonHTMLAttributes } from 'react'
import cn from 'classnames'

import { ReactComponent as ArrowDown } from '../../../../static/img/arrow-down-white.svg'

import * as styles from './styles.module.css'
import shortenNumber from '../../../utils/format'
import useStars from '../../../gatsby/hooks/stars'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { navigate } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { githubDatachainUrl, githubDvcUrl } from '../../../utils/externalUrls'

interface ISectionProps {
  className?: string
  children?: React.ReactNode
}

const SectionWrapper = ({
  className,
  children,
  maxWidth = 'lg'
}: ISectionProps & {
  maxWidth?: 'lg' | 'xl' | '2xl'
}) => (
  <div
    className={cn(
      'w-full flex m-auto',
      {
        'max-w-screen-lg': maxWidth === 'lg',
        'max-w-screen-xl': maxWidth === 'xl',
        'max-w-screen-2xl': maxWidth === '2xl'
      },
      className
    )}
  >
    {children}
  </div>
)

const Section = ({ className, children }: ISectionProps) => (
  <div
    className={cn(
      'w-1/2 px-4 py-5 md:px-6 md:py-10',
      'flex flex-col items-center gap-8',
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
      'min-w-[95px] w-fit',
      'mx-auto',
      'flex items-center justify-center gap-2',
      'text-lg md:text-xl font-medium',
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
      'font-medium ',
      'text-sm sm:text-base md:text-xl',
      'flex items-center',
      'gap-2.5',
      'hover:opacity-80',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

const HeroSection = () => {
  const stars = useStars()
  const datachainStars = useStars('datachain')

  return (
    <div className="md:border-y-2 md:border-solid md:border-y-light">
      {/* Title Section */}
      <SectionWrapper>
        <Section>
          <div className="h-28 flex items-center justify-center">
            <img
              src="/img/logos/datachain-black.svg"
              alt="DVC Logo"
              className="h-16"
            />
          </div>
          <div
            className={cn(
              'flex flex-col gap-4 flex-1 justify-between',
              'lg:flex-row lg:items-center'
            )}
          >
            <h2 className="text-2xl md:text-3xl font-medium">
              GenAI DataChain
            </h2>
            <Link
              href={githubDatachainUrl}
              className="no-underline hover:opacity-80"
            >
              <Badge className="bg-dark text-light">
                {datachainStars ? (
                  shortenNumber(datachainStars, 1)
                ) : (
                  <span className="animate-pulse">---</span>
                )}
                <img
                  src="/img/landing/github.svg"
                  alt="Github Logo"
                  className="h-5 w-5"
                />
              </Badge>
            </Link>
          </div>
        </Section>
        <Section>
          <img src="/img/logos/dvc.svg" alt="DVC Logo" className="h-28" />
          <div
            className={cn('flex flex-col gap-4', 'lg:flex-row lg:items-center')}
          >
            <h2 className="text-2xl md:text-3xl font-medium">
              Data and model versioning
            </h2>
            <Link href={githubDvcUrl} className="no-underline hover:opacity-80">
              <Badge className={cn('bg-dark text-light')}>
                {stars ? (
                  shortenNumber(stars, 1)
                ) : (
                  <span className="animate-pulse">---</span>
                )}
                <img
                  src="/img/landing/github.svg"
                  alt="Github Logo"
                  className="h-5 w-5"
                />
              </Badge>
            </Link>
          </div>
        </Section>
      </SectionWrapper>
      {/* Visualization Section */}
      <SectionWrapper maxWidth="2xl">
        <div className={cn(styles.gridContainer)}>
          <StaticImage
            placeholder="none"
            loading="eager"
            src={'../../../../static/img/landing/Hero Visualization.svg'}
            quality={100}
            formats={['avif', 'webp', 'auto']}
            className={styles.heroViz}
            alt="Visualization"
          />
          <div className={cn(styles.heroDesc, styles.datachainDesc)}>
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
              navigate('#get-started-datachain', {
                state: { focusInput: true }
              })
            }}
          >
            <span>Learn about DataChain</span>
            <ArrowDown className="w-4 md:w-6 animate-bounce" />
          </CTAButton>
        </Section>
        <Section>
          <CTAButton
            className="bg-dark text-light"
            onClick={() => {
              navigate('#get-started-dvc')
            }}
          >
            Download DVC
            <ArrowDown className="w-4 md:w-6 animate-bounce" />
          </CTAButton>
        </Section>
      </SectionWrapper>
    </div>
  )
}

export default HeroSection
