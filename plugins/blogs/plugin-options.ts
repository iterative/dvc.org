import { PluginOptions } from 'gatsby'

export interface IBlogsPluginOptions {
  baseDir: string
  imageMaxWidth: number
  imageMaxWidthHero: number
  imagePreviewWidth: number
  imagePreviewHeight: number
  postsPerPage: number
  postsPerRow: number
}

type BlogsPluginOptions = (pluginOptions: PluginOptions) => IBlogsPluginOptions

export const blogPluginOptions: BlogsPluginOptions = pluginOptions => {
  const defaults: IBlogsPluginOptions = {
    baseDir: process.cwd(),
    imageMaxWidth: 700,
    imageMaxWidthHero: 800,
    imagePreviewWidth: 1200,
    imagePreviewHeight: 630,
    postsPerPage: 9,
    postsPerRow: 3
  }
  return {
    ...defaults,
    ...pluginOptions
  }
}
