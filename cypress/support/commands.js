// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to find the docs sidebar backdrop element
// The backdrop is a full-screen overlay (position: fixed, inset: 0) that appears when sidebar is open
Cypress.Commands.add('getSidebarBackdrop', () => {
  return cy.get('div').then($divs => {
    const backdrop = Array.from($divs).find(div => {
      const rect = div.getBoundingClientRect()
      const styles = window.getComputedStyle(div)
      // Backdrop covers entire screen when visible: position fixed, covers viewport
      const coversViewport =
        rect.width >= window.innerWidth * 0.9 &&
        rect.height >= window.innerHeight * 0.9 &&
        rect.left <= 10 &&
        rect.top <= 10
      const isFixed = styles.position === 'fixed'
      const isVisible =
        rect.width > 0 && rect.height > 0 && styles.opacity !== '0'
      // Check if it has semi-transparent background (backdrop has rgb(0 0 0 / 40%))
      const bgColor = styles.backgroundColor
      const hasBackdropBg =
        bgColor.includes('rgba(0, 0, 0') || bgColor.includes('rgb(0, 0, 0')

      return isVisible && isFixed && coversViewport && hasBackdropBg
    })

    if (!backdrop) {
      throw new Error('Sidebar backdrop not found')
    }

    return cy.wrap(backdrop)
  })
})
