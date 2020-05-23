import { useStaticQuery, graphql } from 'gatsby'

interface IGlossaryEntry {
  name: string
  desc: string
  match: Array<string>
}
interface IGlossary {
  contents: Array<IGlossaryEntry>
}

const useGlossary = (): IGlossary =>
  useStaticQuery(graphql`
    query GlossaryEntries {
      allGlossaryEntry {
        contents: nodes {
          desc: html
          name
          match
        }
      }
    }
  `).allGlossaryEntry

export default useGlossary
