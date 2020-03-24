export const getCommentsCount = (url: string) =>
  fetch(`/api/comments?url=${url}`)
