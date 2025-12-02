describe('Sidebar', () => {
  beforeEach(() => {
    // Visit a documentation page that uses the sidebar
    // Using the docs index page as it should have the sidebar
    cy.visit('/doc')
    // Wait for page to be fully loaded and sidebar to be ready
    cy.findByPlaceholderText(/search docs/i).should('exist')
    cy.findByRole('main').should('exist')
  })

  describe('Sidebar Toggle', () => {
    beforeEach(() => {
      // Set viewport to mobile size to show hamburger menu
      cy.viewport(375, 667)
    })

    it('should toggle sidebar when hamburger button is clicked', () => {
      // Initially, sidebar should not be visible on mobile
      cy.findByPlaceholderText(/search docs/i).should('not.be.visible')

      // Find the docs sidebar hamburger button (positioned at bottom-left)
      cy.getSidebarToggleButton().as('sidebarButton')

      // Click to open sidebar
      cy.get('@sidebarButton').click()
      cy.findByPlaceholderText(/search docs/i).should('be.visible')

      // Click again to close
      cy.get('@sidebarButton').click()
      cy.findByPlaceholderText(/search docs/i).should('not.be.visible')
    })

    it('should close sidebar when backdrop is clicked', () => {
      // Set viewport to mobile size
      cy.viewport(375, 667)

      // Open sidebar first - find the docs sidebar hamburger button
      cy.getSidebarToggleButton().click()
      cy.findByPlaceholderText(/search docs/i).should('be.visible')

      // Click on the actual backdrop element (full-screen overlay)
      cy.getSidebarBackdrop().click({ force: true })

      // Sidebar should be closed
      cy.findByPlaceholderText(/search docs/i).should('not.be.visible')
    })
  })

  describe('Sidebar Menu Items', () => {
    beforeEach(() => {
      // Set viewport to desktop size where sidebar is always visible
      cy.viewport(1280, 720)
    })

    it('should display sidebar menu items', () => {
      // Check that sidebar is visible (search input should be visible)
      cy.findByPlaceholderText(/search docs/i).should('be.visible')

      // Check for common sidebar items (these should exist based on sidebar.json)
      cy.findByRole('link', { name: /home/i }).should('be.visible')
    })

    it('should expand and collapse menu items with children', () => {
      // Find a menu item that has children (like "Install" or "Get Started")
      // Look for links that have a button sibling (expandable items have buttons)
      cy.get('a[id]').then($links => {
        // Find a link that has a button next to it (expandable)
        const expandableLink = Array.from($links).find(link => {
          const nextSibling = link.nextElementSibling
          return nextSibling && nextSibling.tagName === 'BUTTON'
        })

        if (expandableLink) {
          // Find the button that expands this item
          cy.wrap(expandableLink).siblings('button').first().as('expandButton')

          // Get the link's ID to check for children
          const linkId = expandableLink.id
          cy.get('@expandButton').click()

          // Check that children are visible (they should have IDs that start with the parent path)
          cy.get(`a[id^="${linkId}/"]`).should('exist')

          // Click again to collapse
          cy.get('@expandButton').click()
        }
      })
    })

    it('should highlight active menu item', () => {
      // Navigate to a specific doc page
      cy.visit('/doc/install')
      // Wait for page to be fully loaded
      cy.findByPlaceholderText(/search docs/i).should('exist')
      cy.findByRole('main').should('exist')

      // The active item should have aria-current="page"
      cy.findAllByRole('link').filter('[aria-current="page"]').should('exist')
      cy.findAllByRole('link')
        .filter('[aria-current="page"]')
        .should('have.attr', 'id', '/install')
    })

    it('should close sidebar when clicking on a leaf menu item on mobile', () => {
      // Set viewport to mobile size
      cy.viewport(375, 667)

      // Navigate to a page with sidebar
      cy.visit('/doc/install')
      // Wait for page to be fully loaded
      cy.findByPlaceholderText(/search docs/i).should('exist')
      cy.findByRole('main').should('exist')

      // Open sidebar - find the docs sidebar hamburger button
      cy.getSidebarToggleButton().should('be.enabled')
      cy.getSidebarToggleButton().click({ force: true })
      cy.findByPlaceholderText(/search docs/i).should('be.visible')

      // Find and click a leaf item within the sidebar menu
      // Sidebar links have IDs starting with "/doc", so filter to only sidebar links
      cy.findAllByRole('link').then($links => {
        // Find a sidebar link (has ID starting with "/doc") that doesn't have a button sibling (leaf item)
        const sidebarLeafLink = Array.from($links).find(link => {
          // Only consider links that are in the sidebar (have IDs starting with "/doc")
          const hasSidebarId = link.id && link.id.startsWith('/doc')
          if (!hasSidebarId) return false

          // Check if it's a leaf item (no button sibling means it's a leaf)
          const nextSibling = link.nextElementSibling
          const isLeaf = !nextSibling || nextSibling.tagName !== 'BUTTON'
          return isLeaf
        })

        if (sidebarLeafLink) {
          cy.wrap(sidebarLeafLink).click()
          // Sidebar should close after clicking leaf item
          cy.findByPlaceholderText(/search docs/i).should('not.be.visible')
        }
      })
    })
  })

  describe('Search Form', () => {
    beforeEach(() => {
      // Set viewport to desktop size where sidebar is always visible
      cy.viewport(1280, 720)
    })

    it('should display search input in sidebar', () => {
      // Find the search input
      cy.findByPlaceholderText(/search docs/i).should('be.visible')
    })

    it('should allow typing in search input', () => {
      cy.findByPlaceholderText(/search docs/i).as('searchInput')

      // Type in the search input
      cy.get('@searchInput').type('test search')

      // Verify the value
      cy.get('@searchInput').should('have.value', 'test search')
    })

    it('should have search input with correct id', () => {
      cy.findByPlaceholderText(/search docs/i).should('have.id', 'doc-search')
    })
  })

  describe('Sidebar Scrolling', () => {
    beforeEach(() => {
      // Set viewport to desktop size
      cy.viewport(1280, 720)
      // Navigate to a page with an active item
      cy.visit('/doc/install/macos')
      // Wait for page to be fully loaded
      cy.findByPlaceholderText(/search docs/i).should('exist')
      cy.findByRole('main').should('exist')
    })

    it('should scroll to active item when sidebar opens', () => {
      // Wait for scroll animation to complete
      cy.wait(500)

      // The active item should be visible in the viewport
      cy.findAllByRole('link')
        .filter('[aria-current="page"]')
        .should('be.visible')
    })
  })

  describe('External Links', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.visit('/doc/install')
      // Wait for page to be fully loaded
      cy.findByPlaceholderText(/search docs/i).should('exist')
      cy.findByRole('main').should('exist')
    })

    it('should display external link icon for external links', () => {
      // Find external links in the sidebar (they should have target="_blank")
      // Scope to sidebar by finding links that are near the search input in the sidebar structure
      // External links in sidebar have IDs that match sidebar paths
      cy.findByPlaceholderText(/search docs/i).should('be.visible')

      cy.findByLabelText('Documentation Navigation').within(() => {
        cy.findByText('Changelog')
          .findByLabelText('External Link')
          .should('exist')
        cy.findByText('Get Started')
          .findByLabelText('External Link')
          .should('not.exist')
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it('should have proper ARIA attributes', () => {
      // Active page should have aria-current="page"
      cy.findAllByRole('link').filter('[aria-current="page"]').should('exist')
    })

    it('should be keyboard accessible', () => {
      // Test that interactive elements can receive focus
      // Find the search input and wait for it to be enabled before focusing
      cy.findByPlaceholderText(/search docs/i).should('be.visible')
      cy.findByPlaceholderText(/search docs/i).should('not.be.disabled')
      cy.findByPlaceholderText(/search docs/i).focus()
      cy.findByPlaceholderText(/search docs/i).should('be.focused')

      // Test that menu links are keyboard accessible
      cy.findByRole('link', { name: /home/i }).should('be.visible')
      cy.findByRole('link', { name: /home/i }).focus()
      cy.findByRole('link', { name: /home/i }).should('be.focused')
    })
  })
})
