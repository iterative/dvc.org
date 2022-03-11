class Slugger {
  separator: string
  lowercase: boolean
  codePosition: string
  slugs: Array<string>

  constructor(options?: {
    separator?: string
    lowercase?: boolean
    codePosition?: string
  }) {
    this.separator = options?.separator || '-'
    this.lowercase = Boolean(options?.lowercase) && true
    this.codePosition = options?.codePosition || 'end'
    this.slugs = []
  }

  slug(str: string, code?: string, position = this.codePosition) {
    str = typeof str === 'string' ? str : ''
    let slug = this.slugify(str)

    if (this.lowercase) {
      slug = slug.toLowerCase()
    }
    if (code) {
      const codeSlug = this.slugify(code)
      slug =
        position === 'start'
          ? `${codeSlug}${this.separator}${slug}`
          : `${slug}${this.separator}${codeSlug}`
    }
    if (this.slugs.includes(slug)) {
      throw new Error(`Duplicate slug: ${slug} for title:${str}`)
    }
    this.slugs.push(slug)
    return slug
  }
  slugify = (str: string) => {
    return str
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[-\s]+/g, this.separator)
      .replace(this.separator + this.separator, this.separator)
  }
  reset() {
    this.slugs = []
  }
}
export default Slugger
