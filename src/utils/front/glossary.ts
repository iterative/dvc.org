import { useStaticQuery, graphql } from 'gatsby'

const useGlossary = (): object =>
  useStaticQuery(graphql`
    query DVCGlossaryQuery {
      dvcGlossary {
        content
      }
    }
  `).dvcGlossary.content

export default useGlossary
