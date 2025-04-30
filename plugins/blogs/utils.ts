export const tagToSlug = (tag: string) =>
  tag.trim().toLowerCase().replace(/\s/g, `-`).replace(/-+/g, `-`)

export const isProduction = process.env.NODE_ENV === `production`
