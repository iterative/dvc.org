const moment = require('moment')
const {
  getExpirationDate,
  isExpired
} = require('../../../utils/shared/expiration.js')

module.exports = {
  async createSchemaCustomization({
    actions: { createTypes },
    schema: { buildObjectType }
  }) {
    createTypes([
      buildObjectType({
        name: 'CommunityEvent',
        interfaces: ['Node'],
        fields: {
          date: 'Date',
          expires: 'Date',
          expired: 'Boolean',
          title: 'String',
          url: 'String',
          description: 'String',
          sourceIndex: 'Int',
          city: 'String',
          pictureUrl: 'String'
        }
      })
    ])
  },
  async onParseJsonFile(
    {
      node,
      createNodeId,
      createContentDigest,
      actions: { createNode, createParentChildLink }
    },
    { content }
  ) {
    // Only operate on the File node for data.json
    if (node.relativePath !== 'community.json') return null
    const { events } = content

    const eventsPromise =
      events &&
      Promise.all(
        events.map(async (event, sourceIndex) => {
          const { title, date } = event
          const expires = getExpirationDate(event)
          const fields = {
            ...event,
            sourceIndex,
            date: moment(date).toDate(),
            expires: expires ? expires.toDate() : null,
            expired: isExpired(expires)
          }
          const child = {
            id: createNodeId(`Event >>> ${date} >>> ${title}`),
            ...fields,
            parent: node.id,
            children: [],
            internal: {
              type: 'CommunityEvent',
              contentDigest: createContentDigest(fields)
            }
          }
          await createNode(child)
          await createParentChildLink({ parent: node, child })
        })
      )

    return Promise.all([eventsPromise])
  }
}
