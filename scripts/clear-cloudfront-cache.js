#!/usr/bin/env node
'use strict'

import {
  CloudFrontClient,
  CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront'

async function clearCloudfrontCache() {
  const {
    CLOUDFRONT_DISTRIBUTION_ID,
    CONTEXT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
  } = process.env
  if (CONTEXT !== 'production') {
    console.log(
      'Skipping CloudFront cache purge because CONTEXT is not set to production.'
    )
    return
  }

  if (!CLOUDFRONT_DISTRIBUTION_ID) {
    console.error(
      'Skipping CloudFront cache purge because CLOUDFRONT_DISTRIBUTION_ID is not set.'
    )
    return
  }

  const client = new CloudFrontClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  })
  const input = {
    DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }
  const command = new CreateInvalidationCommand(input)
  const response = await client.send(command)
  console.log(
    `Cleared CloudFront cache successfully: ${response.Invalidation.Id}`
  )
}

await clearCloudfrontCache()
