export const getDetails = () => {
  let details = []
  try {
    details = JSON.parse(localStorage.getItem('details') || '[]')
  } catch {}
  return details
}

export const setDetails = details => {
  try {
    localStorage.setItem('details', JSON.stringify(details))
  } catch {}
}
