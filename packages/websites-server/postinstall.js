/* eslint-env node */
// Skip Husky install in production, CI or when used as a dependency
if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  // eslint-disable-next-line n/no-process-exit
  process.exit(0)
}

const { execSync } = require('child_process')
const fs = require('fs')
if (fs.existsSync('.install-husky')) {
  execSync('node .husky/install.mjs', { stdio: 'inherit' })
}
