const path = require('path')

async function firstNodeOfType(context, children, type) {
  return (await context.nodeModel.getNodesByIds({ ids: children, type }))[0]
}

async function descendNodeByTypes(context, children, types) {
  const type = Array.isArray(types) && types[0]
  const currentNode = await firstNodeOfType(context, children, type)
  console.log(types, currentNode)
  if (currentNode) {
    if (types.length <= 1) {
      return currentNode
    } else {
      return descendNodeByTypes(context, currentNode.children, types.slice(1))
    }
  } else {
    return null
  }
}

function resolveNodeFromRelativeFile(type) {
  return async function (source, args, context, info) {
    const relativeChildPath = context.defaultFieldResolver(
      source,
      args,
      context,
      info
    )
    const childSourcePath = path.relative('../', relativeChildPath)
    return context.nodeModel.runQuery({
      query: {
        filter: {
          sourcePath: {
            eq: childSourcePath
          }
        }
      },
      type,
      firstOnly: true
    })
  }
}

function resolveRelativeImage() {
  return async function (source, args, context, info) {
    const relativeChildPath = context.defaultFieldResolver(
      source,
      args,
      context,
      info
    )
    const childSourcePath = path.relative(
      '../../static/uploads',
      relativeChildPath
    )
    const imageNode = await context.nodeModel.runQuery({
      query: {
        filter: {
          fields: {
            sourcePath: {
              eq: childSourcePath
            }
          }
        }
      },
      type: 'ImageSharp',
      firstOnly: true
    })
    return imageNode
  }
}

module.exports = {
  firstNodeOfType,
  descendNodeByTypes,
  resolveNodeFromRelativeFile,
  resolveRelativeImage
}
