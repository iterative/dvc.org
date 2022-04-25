module.exports = ({ remark }) => {
  const plugins = []
  if (remark) {
    plugins.push({
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-embedder',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
              languageExtensions: [
                {
                  language: 'text',
                  definition: {}
                }
              ]
            }
          },
          {
            resolve: 'gatsby-remark-smartypants',
            options: {
              quotes: false
            }
          },
          {
            resolve: 'gatsby-remark-embed-gist',
            options: {
              includeDefaultCss: true
            }
          },
          'gatsby-remark-relative-images',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-external-links',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              enableCustomId: true,
              isIconAfterHeader: true
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              withWebp: true
            }
          },
          'gatsby-remark-responsive-iframe'
        ]
      }
    })
  }
  return {
    plugins
  }
}
