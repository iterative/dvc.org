import { useStaticQuery, graphql } from 'gatsby'

interface IGlossaryCommon {
  name: string
  desc: string
}
interface IGlossaryEntry extends IGlossaryCommon {
  match: Array<string>
}
interface IGlossary extends IGlossaryCommon {
  name: string
  desc: string
  contents: Array<IGlossaryEntry>
}

const useGlossary = (): IGlossary =>
  useStaticQuery(graphql`
    query DVCGlossaryQuery {
      dvcGlossary {
        content
      }
    }
  `).dvcGlossary.content

export default useGlossary
