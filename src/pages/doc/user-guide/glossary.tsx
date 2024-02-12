import React from 'react'
import cn from 'classnames'
import { PageProps } from 'gatsby'
import MainLayout from '../../../components/MainLayout'
import AutoLinkElement from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/WithJSX/AutoLinkElement'
import useGlossary from '@dvcorg/gatsby-theme-iterative/src/utils/front/glossary'

import DocLayout from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout'
import DocWithJsx from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/WithJSX'

const Glossary = ({ location }: PageProps) => {
  const { contents } = useGlossary()
  const pagePath = '/doc/user-guide/glossary'

  return (
    <MainLayout location={location}>
      <DocLayout currentPath={pagePath}>
        <DocWithJsx path={pagePath} headings={[]}>
          <div className={cn('markdown-body')}>
            <AutoLinkElement el="h1" id="glossary">
              Glossary
            </AutoLinkElement>
            {contents
              .sort((c1, c2) => {
                const c1Name = c1.name.toLowerCase()
                const c2Name = c2.name.toLowerCase()
                return c1Name < c2Name ? -1 : c2Name < c1Name ? 1 : 0
              })
              .map(
                ({ name, desc }: { name: string; desc: string }, i: number) => (
                  <p key={i}>
                    <strong>
                      <AutoLinkElement
                        id={name
                          .toLowerCase()
                          .replace(/[^a-zA-Z0-9 ]/g, '')
                          .replace(/ /g, '-')}
                        anchorStyle={{ paddingTop: '4px' }}
                      >
                        {name}
                      </AutoLinkElement>
                    </strong>
                    :{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: desc.replace(/<\/?p>/g, '')
                      }}
                    ></span>
                  </p>
                )
              )}
          </div>
        </DocWithJsx>
      </DocLayout>
    </MainLayout>
  )
}

export default Glossary
