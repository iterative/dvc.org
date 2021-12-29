/* eslint-disable @typescript-eslint/no-var-requires */
const normalizeSidebar = require('../../plugins/gatsby-theme-iterative-docs/normalize-sidebar')
const sidebar = require('../../content/docs/sidebar.json')
module.exports = normalizeSidebar(sidebar)
