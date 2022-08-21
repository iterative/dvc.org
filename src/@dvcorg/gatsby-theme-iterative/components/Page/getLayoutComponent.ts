import MainLayout from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import DocumentationLayout from '@dvcorg/gatsby-theme-iterative/src/components/DocumentationLayout'
import AlertLandingLayout from '@dvcorg/gatsby-theme-iterative/src/components/AlertLandingLayout'

const getLayoutComponent = (props: {
  pageContext: {
    is404: boolean
    isBlog: boolean
    isDocs: boolean
    isAlertLanding: boolean
  }
}) => {
  if (!props.pageContext.is404) {
    if (props.pageContext.isDocs) {
      return DocumentationLayout
    } else if (props.pageContext.isAlertLanding) {
      return AlertLandingLayout
    }
  }
  return MainLayout
}

export default getLayoutComponent
