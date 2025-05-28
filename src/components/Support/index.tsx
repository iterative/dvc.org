import { BrainIcon, NotebookPenIcon, RouteIcon, TargetIcon } from 'lucide-react'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import { cn } from '../../utils'
import PageContent from '../PageContent'
import PromoSection from '../PromoSection'

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
  return (
    <>
      <PageContent>
        <LayoutWidthContainer>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mt-14 text-3xl font-bold">How We Can Help</h1>
            <hr className="mt-14 border-t border-gray-200" />
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
    </>
  )
}

export default SupportPage
