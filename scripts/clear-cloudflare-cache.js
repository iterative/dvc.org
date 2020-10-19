// This script is run inside the S3 deploy script, after everything else, to
// clear the CloudFlare cache of stale page data programmatically.
//
// To clear the cache yourself, you can use the button in the
// cloudflare dashboard ("Caching tab > Purge everything")
//
// This module requires three environment variables to run:
//
// - CONTEXT: The exported function will immediately return without doing
// anything if this variable is not set to "production"
//
// - CLOUDFLARE_TOKEN: a token with the "Zone.Cache Purge" permission.
// You can generate this token in "My Profile > API Tokens"
//
// - CLOUDFLARE_ZONE_ID: The zone ID to purge. You can find it in the
// sidebar of the "overview" tab for dvc.org

const fetch = require('isomorphic-fetch')

module.exports = async function () {
  const { CLOUDFLARE_TOKEN, CLOUDFLARE_ZONE_ID, CONTEXT } = process.env

  if (CONTEXT !== 'production') {
    console.log(
      'Skipping CloudFlare cache purge because CONTEXT is not set to production.'
    )
    return
  }

  if (!(CLOUDFLARE_TOKEN && CLOUDFLARE_ZONE_ID)) {
    console.error(
      'Skipping CloudFlare cache purge because CLOUDFLARE_TOKEN and/or CLOUDFLARE_ZONE_ID are not set.'
    )
    return
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
        'content-type': 'application/json'
      },
      /* eslint-disable @typescript-eslint/camelcase */
      body: JSON.stringify({ purge_everything: true })
      /* eslint-enable @typescript-eslint/camelcase */
    }
  )

  if (!res.ok) {
    throw new Error(
      `CloudFlare cache clear request returned non-ok status ${res.status}: ${res.statusText}`
    )
  }

  const body = await res.json()

  if (!body.success) {
    throw new Error(
      `CloudFlare cache clear failed! ${JSON.stringify(
        {
          status: res.status,
          errors: body.errors
        },
        undefined,
        2
      )}`
    )
  }

  console.log('Cleared CloudFlare cache successfully')
}
