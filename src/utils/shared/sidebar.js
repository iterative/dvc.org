const buildSidebarHelpers = require('../../../plugins/gatsby-theme-iterative-docs/build-sidebar-helpers')
const sidebar = require('../../../content/docs/sidebar.json')
module.exports = buildSidebarHelpers(sidebar)
