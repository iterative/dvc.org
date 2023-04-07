const themeConfig = require('@dvcorg/gatsby-theme-iterative/tailwind.config')

module.exports = {
  ...themeConfig,
  content: [
    ...themeConfig.content,
    './src/**/*.{js,jsx,ts,tsx}',
    './content/**/*.json'
  ],
  theme: {
    ...themeConfig.theme,
    extend: {
      ...themeConfig.theme.extend,
      colors: {
        gray: { hover: '#40364d', dark: 'rgb(26, 30, 35)' },
        purple: { DEFAULT: '#945dd6' },
        blue: { DEFAULT: 'rgb(56, 179, 220)' }
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' }
        }
      },
      animation: {
        slide: 'slide 80s linear infinite',
        'slide-fast': 'slide 40s linear infinite'
      }
    },
    fontFamily: {
      ...themeConfig.theme.fontFamily,
      sans: ['BrandonGrotesque', 'Tahoma', 'Arial', 'sans-serif'],
      mono: ['Consolas', '"Liberation Mono"', 'Menlo', 'Courier', 'monospace']
    }
  }
}
