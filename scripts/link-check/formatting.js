const formatErrors = errorsByFile =>
  errorsByFile
    .map(
      ({ filePath, links }) =>
        `* ${filePath}:\n${links
          .map(({ link, result }) => ` - ${link} => ${result}`)
          .join('\n')}`
    )
    .join('\n')

module.exports = formatErrors
