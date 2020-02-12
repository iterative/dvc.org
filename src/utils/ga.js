import ReactGA from 'react-ga'

export const initGA = () => {
  ReactGA.initialize(`UA-120072346-1`)
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category, action, label) => {
  if (category && action && label) {
    ReactGA.event({ category, action, label })
  } else if (category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
