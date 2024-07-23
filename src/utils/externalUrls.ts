// studio.iterative.ai

export const studioUrl = 'https://studio.iterative.ai'

// cloud.dvc.ai

// Temporarily it's the same as studio
// TODO: change to cloud.dvc.ai

// export const cloudUrl = 'https://cloud.dvc.ai'
export const cloudUrl = studioUrl

// Github Urls
export const githubDatachainUrl = `https://github.com/iterative/datachain`
export const githubDvcUrl = `https://github.com/iterative/dvc`

// HubSpot Forms
interface IHubSpotFormUrlOptions {
  portalId?: string
  formId?: string
}

export const getHubSpotFormUrl = ({
  portalId = `21087317`,
  formId = `e43684c2-476c-4838-adf2-d489da58ad89`
}: IHubSpotFormUrlOptions = {}) =>
  `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`
