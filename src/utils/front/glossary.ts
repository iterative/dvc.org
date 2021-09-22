import { useStaticQuery, graphql } from 'gatsby'

interface IGlossaryEntry {
  name: string
  desc: string
  match: Array<string>
}
interface IGlossary {
  contents: Array<IGlossaryEntry>
}

const useGlossary = (): IGlossary => {
  const data = useStaticQuery(graphql`
    query GlossaryEntries {
      allGlossaryEntry {
        nodes {
          tooltip
          name
          match
        }
      }
    }
  `)
  return {
    contents: data.allGlossaryEntry.nodes.map(
      (node: { name: string; tooltip: string; match: Array<string> }) => ({
        ...node,
        desc: node.tooltip
      })
    )
  }
}
export default useGlossary
