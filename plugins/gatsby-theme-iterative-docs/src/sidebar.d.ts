declare interface INormalizedSidebarItem {
  label: string
  path: string
  source: boolean | string
}

declare const sidebar: INormalizedSidebarItem[]

export default sidebar
