import React, { useState } from 'react'

import PageContent from '../PageContent'
import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

import HeroContainer from '../HeroContainer'
import PromoSection from '../PromoSection'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'
import { BrainIcon, NotebookPenIcon, RouteIcon, TargetIcon } from 'lucide-react'
import { cn } from '../../utils'
import RequestAQuoteDialog from './RequestAQuoteDialog'

const services = [
  {
    icon: BrainIcon,
    title: 'MLOps and DVC experts',
    points: [
      '5+ years experience.',
      'Strong MLOps technical background.',
      'Hands on implementation and development.'
    ]
  },

  {
    icon: RouteIcon,
    title: 'Coverage for all MLOps operations',
    points: [
      'End to end solution: Data version control, project architecture, data pipelines, and data curation',
      'By removing your teams from toil-laden work, you accelerate model development and project delivery.'
    ]
  },
  {
    icon: NotebookPenIcon,
    title: 'Project planning and execution',
    points: [
      'Assist with design and architecture.',
      'Help align projects to platform capabilities.',
      ' Provide inputs to project timelines and resource needs.'
    ]
  },
  {
    icon: TargetIcon,
    title: 'Best practices and standards',
    points: [
      'Architect solutions for scalability.',
      'Develop common standards and frameworks.',
      'Assist with prototype development.'
    ]
  }
]

const colors = ['text-purple', 'text-blue', 'text-orange']

const getAccentColor = (index: number) => {
  return colors[index % colors.length]
}

const SupportPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <>
      <PageContent>
        <HeroContainer className={styles.supportHero}>
          <h1
            className={cn(
              styles.heading,
              'mx-auto',
              'font-extrabold text-5xl text-center'
            )}
          >
            <img
              aria-hidden
              className="inline-block h-32"
              src="/img/support/DVC Platinum Services.svg"
              alt="DVC Platinum Services "
            />{' '}
            <span className="sr-only">DVC Platinum Services </span>
            <span className="inline-block">for ML Operations</span>
          </h1>

          <p
            className={cn(
              'text-center',
              'text-xl',
              'mt-6',
              'mx-auto',
              'max-w-2xl',
              'text-gray-500'
            )}
          >
            Accelerate your business with our world-class data engineering, data
            science, and project management experts and deliver rapid success in
            your ML projects.
          </p>

          <button
            onClick={() => setOpenDialog(true)}
            className={cn(
              'mt-10',
              'mx-auto',
              'block',
              'px-6',
              'py-2',
              'rounded-md',
              'text-lg',
              'font-semibold',
              'text-blue',
              'border-2',
              'border-blue',
              'hover:bg-blue',
              'hover:text-white'
            )}
          >
            Request a quote
          </button>
        </HeroContainer>
        <LayoutWidthContainer>
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="mt-14 italic text-lg">
              <p className="before:content-['\201C'] after:content-['\201D']">
                I can confidently say that DVC AI&apos;s Platinum Engineering
                Services has been an invaluable asset to our team. Their expert
                knowledge and hands-on custom support enabled us to quickly
                scale our ML operations and unlock value from the business.
                Their team has been a pleasure to partner with. I highly
                recommend their services!
              </p>
              <footer className="mt-3">
                <cite className="font-semibold">
                  - Head of MLOps, Fortune 50 Retailer
                </cite>
              </footer>
            </blockquote>
            <hr className="mt-14 border-t border-gray-200" />

            <h2 className="mt-14 text-3xl font-bold">How We Can Help</h2>
            <p className="mt-6 text-xl text-gray-500">
              Successful ML projects are covered in challenges, roadblocks, and
              problems --- and we are here to address them with industry best
              practices
            </p>
          </div>
          <div className="p-4 mt-14 grid gap-8 grid-cols-1 md:grid-cols-2">
            {services.map((service, index) => (
              <div key={index}>
                <h3 className="text-2xl font-medium">
                  {service.icon && (
                    <service.icon
                      size={48}
                      strokeWidth={1.5}
                      className={cn(
                        getAccentColor(index),
                        'inline-block',
                        'mr-2'
                      )}
                    />
                  )}
                  {service.title}
                </h3>
                <ul className="mt-4 list-disc list-inside text-lg text-gray-600">
                  {service.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </LayoutWidthContainer>
      </PageContent>
      <PromoSection
        title="Feel free to join the best community of MLOps experts and enthusiasts !"
        buttons={[
          <Link href="/community" key="get-started">
            Join Our Community
          </Link>
        ]}
      />
      <RequestAQuoteDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  )
}

export default SupportPage
