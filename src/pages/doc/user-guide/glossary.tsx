import React from 'react'

import DocWithJsx from '../../../templates/doc-jsx'
import useGlossary from '../../../utils/front/glossary'

const Glossary: React.FC = () => {
  const { contents } = useGlossary()
  const html = contents
    .sort((c1, c2) => {
      const c1Name = c1.name.toLowerCase()
      const c2Name = c2.name.toLowerCase()
      return c1Name < c2Name ? -1 : c2Name < c1Name ? 1 : 0
    })
    .map(
      ({ name, desc }: { name: string; desc: string }) =>
        `<p><strong>${name}</strong>: ${desc.replace(/<p\/?>/, '')}</p>`
    )
    .join('')

  return (
    <DocWithJsx slug="/doc/user-guide/glossary" headings={[]}>
      <h1 id="glossary">Glossary</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </DocWithJsx>
  )
}

export default Glossary
