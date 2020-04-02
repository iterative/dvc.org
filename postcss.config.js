const nested = require('postcss-nested')
const autoprefixer = require('autoprefixer')
const customMedia = require('postcss-custom-media')
const customProperties = require('postcss-custom-properties')
const mixins = require('postcss-mixins')
const colorMod = require('postcss-color-mod-function')

const mediaConfig = require('./config/postcss/media')
const mixinsConfig = require('./config/postcss/mixins')

module.exports = function postcssConfig() {
  return {
    plugins: [
      mixins(mixinsConfig),
      customMedia({ importFrom: mediaConfig }),
      customProperties({
        importFrom: ['src/components/Page/base.css']
      }),
      nested,
      colorMod({
        importFrom: ['src/components/Page/base.css']
      }),
      autoprefixer
    ]
  }
}
