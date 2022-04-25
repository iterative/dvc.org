const safeQuerySelector = (query: string): null | Element => {
  try {
    const el = document.querySelector(query)
    return el
  } catch (err) {
    return null
  }
}

export default safeQuerySelector
