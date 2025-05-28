module.exports = {
  content: [`${__dirname}/src/**/*.{ts,js,tsx,jsx}`],
  theme: {
    extend: {
      screens: {
        xxsMax: { max: '376px' },
        xsMax: { max: '572px' },
        smMax: { max: '768px' },
        mdMax: { max: '1004px' },
        xs: '572px',
        lg: '1005px',
        xl: '1200px'
      }
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.hover': {
          '&:hover': {
            opacity: 0.7
          }
        },
        '.focus': {
          '&:focus': {
            color: 'var(--color-orange)'
          }
        },
        '.active': {
          '&:active': {
            position: 'relative',
            top: '1px',
            left: '1px'
          }
        }
      })
    }
  ]
}
