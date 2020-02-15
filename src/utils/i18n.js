export function pluralize(entry, count) {
  let key

  if (count === 0 && entry.zero) {
    key = 'zero'
  } else if (count === 1) {
    key = 'one'
  } else {
    key = 'other'
  }

  return entry[key].replace('{count}', count.toString())
}

export function pluralizeComments(count) {
  return pluralize(
    { zero: 'No comments', one: '{count} comment', other: '{count} comments' },
    count
  )
}
