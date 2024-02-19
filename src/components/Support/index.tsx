import React from 'react'

import PageContent from '../PageContent'
import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

import HeroContainer from '../HeroContainer'
import PromoSection from '../PromoSection'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'
import { BrainIcon, NotebookPenIcon, RouteIcon, TargetIcon } from 'lucide-react'
import { cn } from '../../utils'

const services = [
  {
    icon: BrainIcon,
    title: 'MLOps and DVC experts',
    points: [
      <>
        5+ years <span>experience</span>.
      </>,
      <>
        Strong MLOps <span>technical</span> background.
      </>,
      <>
        <span>Hands on</span> implementation and development.
      </>
    ]
  },

  {
    icon: RouteIcon,
    title: 'Coverage for all MLOps operations',
    points: [
      <>
        <span>End to end solution: </span>
        Data version control, project architecture, data pipelines, and data
        curation
      </>,
      <>
        By removing your teams from toil-laden work, you{' '}
        <span>accelerate model development</span> and{' '}
        <span>project delivery</span>.
      </>
    ]
  },
  {
    icon: NotebookPenIcon,
    title: 'Project planning and execution',
    points: [
      <>
        Assist with <span>design</span> and <span>architecture</span>.
      </>,
      <>
        Help align projects to <span>platform capabilities</span>.
      </>,
      <>
        {' '}
        Provide inputs to <span>project timelines</span> and{' '}
        <span>resource needs</span>.
      </>
    ]
  },
  {
    icon: TargetIcon,
    title: 'Best practices and standards',
    points: [
      <>
        <span>Architect</span> solutions for scalability.
      </>,
      <>
        <span>Develop</span> common standards and frameworks.
      </>,
      <>
        <span>Assist</span> with prototype development.
      </>
    ]
  }
]

const colors = ['text-purple', 'text-blue', 'text-orange']

const getAccentColor = (index: number) => {
  return colors[index % colors.length]
}

const getSpanAccentColor = (index: number) => {
  const spanColors = [
    '[&>span:nth-child(3n-2)]:text-purple [&>span:nth-child(3n-1)]:text-blue [&>span:nth-child(3n)]:text-orange',
    '[&>span:nth-child(3n-2)]:text-blue [&>span:nth-child(3n-1)]:text-orange [&>span:nth-child(3n)]:text-purple',
    '[&>span:nth-child(3n-2)]:text-orange [&>span:nth-child(3n-1)]:text-purple [&>span:nth-child(3n)]:text-blue'
  ]
  return spanColors[index % colors.length]
}

const successStories = [
  {
    company: 'UBS',
    logo: '/logos/ubs.png',
    logoClassName: 'invert',
    summary: `Iterative is a strategic partner for the AI element of UBS’s in-house data platform. Our
    team is being leveraged to design a standardized ML development environment with full
    reproducibility and audibility in mind. The project scope went from 6 months to 1 month.`
  },
  {
    company: 'Walmart',
    logo: '/logos/walmart.svg',
    logoClassName: 'w-48 object-cover',
    summary: `In addition the DVCx platform being instrumental in Walmart’s GenAI pipelines, Walmart
    leverages Iterative Platinum Services to integrate their entire MLOps pipeline and get
    support for their specific ML use cases to accelerate adoption and development speed.`
  },
  {
    company: 'Omnisens',
    logo: 'https://via.placeholder.com/150',
    summary: `Omnisens was earlier in their ML journey when they started to engage the Iterative
    Platinum Services team. Because of their stage in the journey, they leveraged the
    services to assist in designing their overall MLOps architecture to ensure project success
    for years to come. We split one large MLOps pipeline into smaller pipelines that can be
    developed independently and fed into downstream pipeline steps. This approach is
    similar to developing microservices for more independent development across your
    MLOps process for speed of development (while still cooperating effectively as a larger
    team).`
  },
  {
    company: 'Tempus',
    logo: 'https://via.placeholder.com/150',
    summary: `Tempus Labs needed a full redesign of their ML workflows and needed to simplify their
    existing codebase considerably while adding new capabilities with deeper integration
    with DVC. Together, we designed a roadmap on how to transition gradually in steps, so
    that the team did not have to halt production progress at any point.`
  },
  {
    company: 'PACCAR',
    logo: 'https://via.placeholder.com/150',
    summary: `The PACCAR team was looking to supplement their ML engineering capacity so that they
    could keep pushing their model development forward (all while also building out their
    monorepo architecture). The goal here was to create a template structure for their DVC
    pipelines to all for more reusability and to remove redundancy in code (making iterations
    easier and less error-prone).`
  },
  {
    company: 'PlasmaSolve',
    logo: 'https://via.placeholder.com/150',
    summary: `The team spent 1 year trying to integrate DVC into their software platform without
    success, and in 2 weeks we are able to provide a working proof of concept and then in
    just another 2 weeks we polished and completed the project.`
  }
]

const SupportPage: React.FC = () => (
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
          Platinum Services for ML Operations
        </h1>
        <p
          className={cn(
            'text-center',
            'text-xl',
            'mt-5',
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
              knowledge and hands-on keyboard support enabled us to quickly
              scale our ML operations and unlock value from the business. Their
              team has been a pleasure to partner with. I highly recommend their
              services!
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
                  <li key={index} className={cn(getSpanAccentColor(index))}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-3xl font-bold">Customer Success Stories</h2>
          <p className="mt-6 text-xl text-gray-500">
            Our customers have seen significant improvements in their ML
            projects. Here are a few stories of how we helped them.
          </p>
        </div>

        <div className="mt-14 grid gap-8 grid-cols-1 md:grid-cols-2">
          {successStories.map((story, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-center">
                <img
                  src={story.logo}
                  alt={`${story.company} logo`}
                  className={cn(
                    'w-24 h-24 rounded-md object-contain',
                    story.logoClassName
                  )}
                />
              </div>
              <p className="mt-4 text-lg text-gray-600 text-center">
                {story.summary}
              </p>
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
  </>
)

export default SupportPage
