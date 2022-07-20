module.exports = async ({ github, context }) => {
  const sha = context.sha
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name
  const { data: pulls } = await github.rest.pulls.list({
    state: 'open',
    owner,
    repo
  })
  const actionPull = pulls.find(pull => pull.head.sha === sha)
  return actionPull.number
}
