#!/usr/bin/env node
/* global process */

// This script runs just before the app starts. If we are running the
// production heroku app (the only one with the below env variables)
// the cache gets cleared.
//
// To clear the cache yourself, you can use the button in the
// cloudflare dashboard ("Caching tab > Purge everything"), or run
// this script with the required environment variables:
//
// - CLOUDFLARE_TOKEN: a token with the "Zone.Cache Purge" permission.
// You can generate this token in "My Profile > API Tokens"
//
// - CLOUDFLARE_ZONE_ID: The zone ID to purge. You can find it in the
// sidebar of the "overview" tab for dvc.org

const fetch = require('isomorphic-fetch')

const { CLOUDFLARE_TOKEN, CLOUDFLARE_ZONE_ID, CONTEXT } = process.env

async function main() {
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

  const body = await res.json()
  console.log('Temporary cache debug logging: ', body)

  if (!res.ok) {
    throw new Error('Error response received from CloudFlare: ' + body)
  }
  console.log('Cleared cache successfully')
}

if (CONTEXT === 'production') {
  if (!(CLOUDFLARE_TOKEN && CLOUDFLARE_ZONE_ID)) {
    console.error(
      'scripts/clear-cloudflare-cache.js: ' +
        'need CLOUDFLARE_TOKEN and CLOUDFLARE_ZONE_ID environment variables.'
    )
    process.exit(1)
  }

  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
