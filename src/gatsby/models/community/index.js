const moment = require('moment')
const { getExpirationFields } = require('../../../utils/shared/expiration.js')

function expiredNodesLog(typeName, nodes) {
  if (nodes.length > 0) {
    return `${nodes.length} ${typeName}:\n${nodes
      .map(({ sourceIndex, expires }) => `- #${sourceIndex} expired ${expires}`)
      .join('\n')}\n`
  }
}

function childNodeCreator({
  node,
  actions: { createNode, createParentChildLink }
}) {
  return async function ({ children = [], ...rest }) {
    const newNode = {
      parent: node.id,
      children,
      ...rest
    }

    await createNode(newNode)
    await createParentChildLink({ parent: node, child: newNode })
  }
}

const expirationFields = {
  expires: {
    type: 'Date',
    extensions: {
      dateformat: {}
    }
  },
  expired: 'Boolean'
}

module.exports = {
  async createSchemaCustomization({
    actions: { createTypes },
    schema: { buildObjectType }
  }) {
    createTypes([
      buildObjectType({
        name: 'CommunityHero',
        interfaces: ['Node'],
        fields: {
          date: 'Date',
          url: 'String',
          sourceIndex: 'Int',
          pictureDesktop: 'String',
          pictureMobile: 'String',
          ...expirationFields
        }
      }),
      buildObjectType({
        name: 'CommunityEvent',
        interfaces: ['Node'],
        fields: {
          date: 'Date',
          title: 'String',
          url: 'String',
          description: 'String',
          sourceIndex: 'Int',
          city: 'String',
          pictureUrl: 'String',
          ...expirationFields
        }
      }),
      buildObjectType({
        name: 'CommunityRest',
        interfaces: ['Node'],
        fields: {
          content: 'JSON'
        }
      })
    ])
  },
  async onParseJsonFile(api, { content }) {
    const createChildNode = childNodeCreator(api)
    const { node, createNodeId, createContentDigest } = api
    // Only operate on the File node for data.json
    if (node.relativePath !== 'community.json') return null
    const { events, hero, ...rest } = content

    const heroesPromise =
      hero &&
      Promise.all(
        hero.map(async (hero, sourceIndex) => {
          const { expires, expired } = getExpirationFields(hero)
          const fields = {
            ...hero,
            expires,
            expired,
            sourceIndex
          }
          await createChildNode({
            id: createNodeId(`CommunityHero >>> ${sourceIndex}`),
            ...fields,
            internal: {
              type: 'CommunityHero',
              contentDigest: createContentDigest(fields)
            }
          })
        })
      )

    const eventsPromise =
      events &&
      Promise.all(
        events.map(async (event, sourceIndex) => {
          const { title, date } = event
          const { expires, expired } = getExpirationFields(event)
          const fields = {
            ...event,
            sourceIndex,
            date: date ? moment(date).toDate() : null,
            expires,
            expired
          }
          await createChildNode({
            id: createNodeId(`Event >>> ${date} >>> ${title}`),
            ...fields,
            internal: {
              type: 'CommunityEvent',
              contentDigest: createContentDigest(fields)
            }
          })
        })
      )

    /*
       Create a catch-all node with the rest of the data from community.json
       accessible as a JSON field. This way, we don't have to duplicate imported
       data before updating all Community components.
    */
    const restPromise = createChildNode({
      id: createNodeId(`DVCCommunityRest`),
      content: rest,
      internal: {
        type: 'CommunityRest',
        contentDigest: createContentDigest(rest)
      }
    })

    return Promise.all([heroesPromise, eventsPromise, restPromise])
  },
  async onPostBuild({ graphql }) {
    const query = await graphql(`
      query ExpiredItemQuery {
        events: allCommunityEvent(
          filter: { expired: { eq: true } }
          sort: { fields: [sourceIndex] }
        ) {
          nodes {
            expires(formatString: "YYYY-MM-DD")
            sourceIndex
          }
        }
        heroes: allCommunityHero(
          filter: { expired: { eq: true } }
          sort: { fields: [sourceIndex] }
        ) {
          nodes {
            sourceIndex
            expires(formatString: "YYYY-MM-DD")
          }
        }
      }
    `)

    // Only log anything if there's an expired node of any type
    const typeLogs = []
    for (const [name, { nodes }] of Object.entries(query.data)) {
      if (nodes.length === 0) continue
      typeLogs.push(expiredNodesLog(name, nodes))
    }

    if (typeLogs.length > 0) {
      const typeLogsString = typeLogs.join('\n')
      console.warn(
        `There are expired Nodes in community.json!\n${typeLogsString}`
      )
    }
  }
}
