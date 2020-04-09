const serveHandler = require('serve-handler')

module.exports = (req, res) => {
  serveHandler(req, res, {
    public: 'public',
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false,
    headers: [
      {
        source: '**/*.@(jpg|jpeg|gif|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=86400'
          }
        ]
      },
      {
        source: '!**/*.@(jpg|jpeg|gif|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0'
          }
        ]
      }
    ]
  })
}
