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
        blue: { DEFAULT: '#13ADC7', hover: '#13a3bd' },
        orange: { DEFAULT: '#F46737' },
        indigo: { DEFAULT: '#4B2E70' },
        dark: { DEFAULT: '#1A1E23' },
        light: { DEFAULT: '#EEF4F8' }
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50.2%, 0, 0)' }
        }
      },
      animation: {
        slide: 'slide 80s linear infinite',
        'slide-fast': 'slide 40s linear infinite'
      },
      backgroundImage: {
        'gradient-126': 'linear-gradient(126deg, var(--tw-gradient-stops))'
      }
    },
    fontFamily: {
      ...themeConfig.theme.fontFamily,
      sans: ['BrandonGrotesque', 'Tahoma', 'Arial', 'sans-serif'],
      mono: ['Consolas', '"Liberation Mono"', 'Menlo', 'Courier', 'monospace']
    }
  },
  plugins: [...themeConfig.plugins, require(`tailwindcss-animate`)]
}
