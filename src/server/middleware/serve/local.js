const serveHandler = require('serve-handler')

module.exports = async (req, res) => {
  await serveHandler(req, res, {
    public: 'public',
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false
  })
}
