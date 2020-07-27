const path = require('path')
const { exec } = require('child_process')

const { uniq, flatten } = require('lodash')

const linkCheck = require('./link-check.js')

const DEFAULT_BASE_URL = 'https://dvc.org'

const matchFirstGroups = (input, regex) =>
  Array.from(input.matchAll(regex), x => x[1])

const getGitDiff = async () =>
  new Promise((resolve, reject) => {
    exec('git diff origin/master HEAD', (err, stdout) =>
      err ? reject(err) : resolve(stdout)
    )
  })

const getAddedLines = async () => {
  const splitOutput = (await getGitDiff()).split(
    /^diff --git.* b\/(.*)\n(?:.*\n){4}/gm
  )
  const processedOutputs = []
  for (let i = 1; i < splitOutput.length; i += 2) {
    const additions = splitOutput[i + 1]
      .split('\n')
      .map(line => line.startsWith('+') && line)
      .filter(Boolean)

    if (additions.length > 0) {
      processedOutputs.push({
        filePath: splitOutput[i],
        additions
      })
    }
  }
  return processedOutputs
}

const scrapeLinks = (filePath, content) => {
  let matchedLinks = []
  const ext = path.extname(filePath)

  switch (ext) {
    case '.md':
      matchedLinks = matchedLinks.concat(
        matchFirstGroups(content, /\[.*?\]\((.*?)\)/gm)
      )
      break
    case '.html':
      matchedLinks = matchedLinks.concat(
        matchFirstGroups(content, /href="(.*?)"/gm)
      )
    default:
      matchedLinks =
        content.match(/https?:(\/\/)?(\w+\.)?(\w+)\.([\w\/\.]+)/gm) || []
      break
  }
  return matchedLinks
}

const getAddedLinks = async () =>
  (await getAddedLines())
    .map(({ filePath, additions }) => {
      const foundLinks = flatten(
        additions.map(line => scrapeLinks(filePath, line))
      )
      if (foundLinks.length > 0) {
        return {
          filePath,
          links: uniq(foundLinks)
        }
      }
    })
    .filter(Boolean)

const getCheckedAddedLinks = async (baseURL = DEFAULT_BASE_URL) =>
  Promise.all(
    (await getAddedLinks()).map(async ({ filePath, links }) => ({
      filePath,
      links: await Promise.all(links.map(link => linkCheck(link, baseURL)))
    }))
  )

const getFailingAddedLinks = async baseURL => {
  const checkedLinksByFile = await getCheckedAddedLinks(baseURL)

  // Filter finished linkChecks to only errors
  const errorsByFile = checkedLinksByFile
    .map(({ filePath, links }) => {
      const badLinks = links.filter(link => !link.ok)
      return badLinks.length > 0
        ? {
            filePath,
            links: badLinks
          }
        : null
    })
    .filter(Boolean)

  // Return errors if they exist, or null upon success (like a traditional callback)
  return errorsByFile.length > 0 ? errorsByFile : null
}

module.exports = {
  getCheckedAddedLinks,
  getFailingAddedLinks
}
