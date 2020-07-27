const core = require('@actions/core')
const { getFailingAddedLinks } = require('./link-check-git-diff.js')
const { formatErrors } = require('./formatting.js')

try {
  getFailingAddedLinks(core.getInput('baseURL')).then(failedChecks => {
    // Return either a success message or a report of all failed checks
    if (failedChecks) {
      core.setOutput('summary', 'Some new links failed the check.')
      core.setOutput(
        'details',
        `The following links failed the link check:\n${formatErrors(
          failedChecks
        )}`
      )
      core.setOutput('conclusion', 'failure')
    } else {
      core.setOutput('summary', 'All new links passed the check!')
      core.setOutput('conclusion', 'success')
    }
  })
} catch (e) {
  core.setFailed(`Link checker had an error! (${e.message})`)
}
