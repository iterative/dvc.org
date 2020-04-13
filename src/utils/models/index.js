function runModelApi(models, name, api, options) {
  return Promise.all(
    models.map(
      model =>
        typeof model[name] === 'function' && model[name](api, options, models)
    )
  )
}

/** Model API builder
    (models:Array<Model>, childApi:Any?) => (name:String) => (api, options) => Promise

    General usage:

    1. In gatsby-node, outside of any api calls, store the result of this function called with
       an array of all models.
    2. Call the function returned from step 1 with the name of the function you want to run on
       all models.
    3. Use the value from step 2 as a gatsby call, or manually call it within another function using
       the first two positional parameters from Gatsby.
    4. Return or await the promise received from step 3. Don't worry about the promises' return values.
 */
function buildModelApi(models, childAPI = { models }) {
  return function apiRunnerFromName(name) {
    return async function runApiWithGatsby(api, options) {
      return Promise.all(
        models.map(
          model =>
            typeof model[name] === 'function' &&
            model[name](api, options, childAPI)
        )
      )
    }
  }
}

module.exports = buildModelApi
