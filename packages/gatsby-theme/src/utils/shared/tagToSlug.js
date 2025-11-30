const slugify = tag =>
  tag.trim().toLowerCase().replace(/\s/g, '-').replace(/-+/g, '-')
export default slugify
