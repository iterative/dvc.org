import React from 'react'

import DocWithJsx from '../../../templates/doc-jsx'
import AutoLinkElement from 'gatsby-theme-iterative-docs/src/components/Documentation/WithJSX/AutoLinkElement'
import useGlossary from 'gatsby-theme-iterative-docs/src/utils/front/glossary'

const Glossary: React.FC = () => {
  const { contents } = useGlossary()

  return (
    <DocWithJsx slug="/doc/user-guide/glossary" headings={[]}>
      <AutoLinkElement el="h1" id="glossary">
        Glossary
      </AutoLinkElement>
      {contents
        .sort((c1, c2) => {
          const c1Name = c1.name.toLowerCase()
          const c2Name = c2.name.toLowerCase()
          return c1Name < c2Name ? -1 : c2Name < c1Name ? 1 : 0
        })
        .map(({ name, desc }: { name: string; desc: string }, i: number) => (
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
              dangerouslySetInnerHTML={{ __html: desc.replace(/<\/?p>/g, '') }}
            ></span>
          </p>
        ))}
    </DocWithJsx>
  )
}

export default Glossary
