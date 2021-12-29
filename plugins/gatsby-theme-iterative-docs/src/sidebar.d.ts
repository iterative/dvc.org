declare interface INormalizedSidebarItem {
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
}

declare const sidebar: INormalizedSidebarItem[]

export default sidebar
