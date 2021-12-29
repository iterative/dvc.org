export interface INormalizedSidebarItem {
  label: string
  path: string
  source?: string
  prev?: string
  next?: string
  icon?: string
  style?: string
  tutorials?: {
    katacoda: string
  }
  children?: INormalizedSidebarItem[]
  type?: string
}

declare const sidebar: INormalizedSidebarItem[]

export default sidebar
