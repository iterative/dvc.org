import { PageProps } from 'gatsby'
import ThemeMainLayout, {
  LayoutModifiers,
  ILayoutComponentProps
} from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

interface IMainLayoutProps extends ILayoutComponentProps {
  location: PageProps['location']
}

const MainLayout = ({ children, ...props }: IMainLayoutProps) => {
  return (
    <ThemeMainLayout {...props} modifiers={[LayoutModifiers.HideAlert]}>
      {children}
    </ThemeMainLayout>
  )
}

export default MainLayout
