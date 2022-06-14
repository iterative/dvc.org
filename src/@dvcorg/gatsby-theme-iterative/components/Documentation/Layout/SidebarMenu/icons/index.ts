import defaultIcons, {
  SidebarIcons
} from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout/SidebarMenu/icons'
import { ReactComponent as CMLIcon } from './cml-icon.svg'
import { ReactComponent as StudioIcon } from './studio-icon.svg'
import { ReactComponent as VsCodeIcon } from './vscode-icon.svg'

const customizedIcons: SidebarIcons = {
  ...defaultIcons,
  cml: CMLIcon,
  studio: StudioIcon,
  vscode: VsCodeIcon
}

export default customizedIcons
