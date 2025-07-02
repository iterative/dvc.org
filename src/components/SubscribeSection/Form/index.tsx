import { Script } from 'gatsby'
import { useEffect, useState } from 'react'

import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import './hubspot.css'

const Form: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [formLoaded, setFormLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (scriptLoaded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).hbspt.forms.create({
        portalId: '8040338',
        formId: '2912f9fd-d4db-40c2-9f57-b9c30fa57ef2',
        region: 'na1',
        target: '#email-subscription-form-hbspot',
        cssRequired: false,
        cssClass: 'email-subscription-form',
        submitText: 'Subscribe',
        submitButtonClass: 'email-subscribe-btn',
        errorClass: 'email-subscribe-error',
        errorMessageClass: 'email-subscribe-error-message',
        onFormReady: () => setFormLoaded(true),
        onFormSubmitted: () => {
          logEvent('Subscribe Form')
        }
      })
    }
  }, [scriptLoaded])

  return (
    <>
      {!formLoaded && !error && (
        <div className="hubspot-form-loading-message hubspot-form-message">
          Loading form...
        </div>
      )}
      {error && (
        <div className="hubspot-form-loading-failed-message hubspot-form-message">
          There was an error loading the form. Please try again later.
        </div>
      )}
      <Script
        type="text/javascript"
        src="//js.hsforms.net/forms/embed/v2.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError(true)}
      />
      <div id="email-subscription-form-hbspot"></div>
    </>
  )
}

export default Form
