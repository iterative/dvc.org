import { Script } from 'gatsby'
import { useEffect, useState } from 'react'

import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import * as styles from './styles.module.css'

const supportRedirect = false

interface SubmissionValue {
  name: 'email'
  value: string
}

interface HubSpotFormConfig {
  // https://developers.hubspot.com/docs/reference/cms/forms/legacy-forms
  portalId: string
  formId: string
  region: string
  target: string
  redirectUrl?: string
  inlineMessage?: string
  pageId?: number | string
  cssRequired?: boolean
  cssClass?: string
  css?: string
  submitText?: string
  submitButtonClass?: string
  errorClass?: string
  errorMessageClass?: string
  locale?: string
  translations?: object
  manuallyBlockedEmailDomain?: string[]
  formInstanceId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBeforeFormInit?: (ctx: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormReady?: ($form: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormSubmit?: ($form: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBeforeFormSubmit?: ($form: any, submissionValues: SubmissionValue[]) => void
  onFormSubmitted?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $form: any,
    data: { redirectUrl?: string; submissionValues: SubmissionValue[] }
  ) => void
}

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create: (config: HubSpotFormConfig) => void
      }
    }
  }
}

const Form: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [formLoaded, setFormLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (scriptLoaded) {
      try {
        if (!window.hbspt?.forms?.create) {
          throw new Error('HubSpot forms API not available')
        }

        window.hbspt.forms.create({
          portalId: '8040338',
          formId: '2912f9fd-d4db-40c2-9f57-b9c30fa57ef2',
          region: 'na1',
          target: `#${styles.emailSubscriptionFormHubspotTarget}`,
          cssRequired: false,
          cssClass: styles.emailSubscriptionForm,
          submitText: 'Subscribe',
          submitButtonClass: styles.emailSubscribeBtn,
          errorClass: 'email-subscribe-error',
          errorMessageClass: styles.emailSubscribeErrorMessage,
          onBeforeFormInit: () => setFormLoaded(true),
          onFormSubmitted: (_, data) => {
            logEvent('Subscribe Form')
            if (supportRedirect && data.redirectUrl) {
              window.location.href = data.redirectUrl
            }
          }
        })
      } catch (e) {
        console.error('Error creating HubSpot form:', e)
        setError(true)
      }
    }
  }, [scriptLoaded])

  return (
    <>
      {!formLoaded && !error && (
        <div className={styles.hubspotFormMessage}>&nbsp;</div>
      )}
      {error && (
        <div
          className={`${styles.hubspotFormLoadingFailedMessage} ${styles.hubspotFormMessage}`}
        >
          There was an error loading the form. Please try again later.
        </div>
      )}
      <Script
        type="text/javascript"
        src="//js.hsforms.net/forms/embed/v2.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError(true)}
      />
      <div id={styles.emailSubscriptionFormHubspotTarget}></div>
    </>
  )
}

export default Form
