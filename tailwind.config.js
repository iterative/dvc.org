const themeConfig = require('@dvcorg/gatsby-theme-iterative/tailwind.config')

module.exports = {
  ...themeConfig,
  content: [...themeConfig.content, './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    ...themeConfig.theme,
    extend: {
      ...themeConfig.theme.extend,
      colors: {
        gray: { hover: '#40364d' }
      }
    },
    fontFamily: {
      ...themeConfig.theme.fontFamily,
      sans: ['BrandonGrotesque', 'Tahoma', 'Arial', 'sans-serif'],
      mono: ['Consolas', '"Liberation Mono"', 'Menlo', 'Courier', 'monospace']
    }
  }
}
