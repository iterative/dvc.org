import React from 'react'

export default {
  label: 'Image',
  id: 'image',
  fromBlock: match =>
    match && {
      image: match[2],
      alt: match[1],
      details: match[4]
    },
  toBlock: ({ alt, image, details }) =>
    `![${alt || ''}](${image || ''}${
      details ? ` '${details.replace(/'/g, "\\'")}'` : ''
    })`,
  // eslint-disable-next-line react/display-name
  toPreview: ({ alt, image, details }, getAsset, fields) => {
    const imageField = fields?.find(f => f.get('widget') === 'image')
    const src = getAsset(image, imageField)
    return <img src={src || ''} alt={alt || ''} details={details || ''} />
  },
  pattern: /^!\[(.*)\]\((.*?)(\s'(.*)')?\)$/,
  fields: [
    {
      label: 'Image',
      name: 'image',
      widget: 'image',
      media_library: {
        allow_multiple: false
      }
    },
    {
      label: 'Alt Text',
      name: 'alt'
    },
    {
      label: 'Details',
      name: 'details'
    }
  ]
}
