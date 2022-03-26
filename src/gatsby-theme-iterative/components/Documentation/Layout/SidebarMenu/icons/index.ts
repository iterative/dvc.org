import defaultIcons, {
  SidebarIcons
} from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout/SidebarMenu/icons'
import { ReactComponent as CMLIcon } from './cml-icon.svg'
import { ReactComponent as StudioIcon } from './studio-icon.svg'

const customizedIcons: SidebarIcons = {
  ...defaultIcons,
  cml: CMLIcon,
  studio: StudioIcon
}

export default customizedIcons
