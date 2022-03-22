import MainLayout from 'gatsby-theme-iterative-docs/src/components/MainLayout'
import DocumentationLayout from 'gatsby-theme-iterative-docs/src/components/DocumentationLayout'
import AlertLandingLayout from 'gatsby-theme-iterative-docs/src/components/AlertLandingLayout'
import BlogLayout from '../../../components/Blog/Layout'

const getLayoutComponent = (props: {
  pageContext: {
    is404: boolean
    isBlog: boolean
    isDocs: boolean
    isAlertLanding: boolean
  }
}) => {
  if (!props.pageContext.is404) {
    if (props.pageContext.isBlog) {
      return BlogLayout
    } else if (props.pageContext.isDocs) {
      return DocumentationLayout
    } else if (props.pageContext.isAlertLanding) {
      return AlertLandingLayout
    }
  }
  return MainLayout
}

export default getLayoutComponent
