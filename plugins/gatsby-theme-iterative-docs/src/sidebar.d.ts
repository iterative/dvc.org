declare interface NormalizedSidebarItem {
  label: string
  path: string
  source: boolean | string
}

declare const sidebar: NormalizedSidebarItem[]

export default sidebar
