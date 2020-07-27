const formatErrors = errorsByFile =>
  errorsByFile
    .map(
      ({ filePath, links }) =>
        `* ${filePath}:\n${links
          .map(
            ({ link, href, result }) =>
              ` - ${link}${
                href && href !== link ? ` (${href})` : ''
              } => ${result}`
          )
          .join('\n')}`
    )
    .join('\n')

module.exports = formatErrors
