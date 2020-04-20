/** Model API runner
  (
    models: Array<Model>
      The array of models to run the action on.
    name: string
      If any model has a function under under this key, that function will be run.
    ...childArgs
      All arguments passed after models and name are forwarded to the child calls.
      Generally, you'd put the Gatsby API object here and then any other data to
      pass along.
  )

  Standard usage:
    In a Gatsby API, this mimics the original Gatsby call on all Models:

    exports.onCreateNode = (api) =>
      asyncCallOnAll(models, "onCreateNode", api)

    You can also call this within another function if you want to use Models
    within a regular gatsby-node function.
*/

async function asyncCallOnAll(models, apiName, ...childArgs) {
  return Promise.all(
    models.map(
      model => typeof model[name] === 'function' && model[name](...childArgs)
    )
  )
}

module.exports = asyncCallOnAll
