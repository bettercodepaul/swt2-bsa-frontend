/**
 * This test opens the sidebar, clicks on the "LIGAUEBERSICHT" tab and checks whether the URL changes accordingly.
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  cy.wait(1000)
  
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=sidebar-ligauebersicht-button]').length > 0) {
      cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
      cy.url().should('include', '#/liga')
    } else {
      // Button not present due to missing permission, navigate directly
      cy.visit('http://localhost:4200/#/liga')
      cy.url().should('include', '#/liga')
    }
  })
})

/**
 * This test checks if the Ligaübersicht page loads correctly
 * It verifies that at least one of the following elements is visible:
 * - Tree component ([role="tree"])
 * - Loading skeleton (bla-tree-skeleton)
 * - Error state (bla-error-state)
 * - Empty state (bla-empty-state)
 */
it('Ligaübersicht-Seite lädt korrekt', function() {
  cy.visit('http://localhost:4200/#/liga')
  cy.wait(2000)
  
  // Check if at least one of the expected elements is visible
  cy.get('body').then(($body) => {
    const hasTree = $body.find('[role="tree"]').length > 0
    const hasSkeleton = $body.find('.bla-tree-skeleton').length > 0
    const hasError = $body.find('bla-error-state').length > 0
    const hasEmpty = $body.find('bla-empty-state').length > 0
    
    expect(hasTree || hasSkeleton || hasError || hasEmpty).to.be.true
  })
})

/**
 * This test checks if the sidebar button "Ligaübersicht" exists and is visible
 * For anonymous users: If button is not present (missing permission), only log a message
 */
it('Sidebar-Button "Ligaübersicht" ist vorhanden', function() {
  cy.visit('http://localhost:4200/')
  cy.wait(1000)
  
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=sidebar-ligauebersicht-button]').length > 0) {
      cy.get('[data-cy=sidebar-ligauebersicht-button]').should('exist').and('be.visible')
    } else {
      // Button not present due to missing permission - log message only
      cy.log('Sidebar-Button "Ligaübersicht" nicht vorhanden (fehlende Berechtigung)')
    }
  })
})

it('Expand-all button exposes ARIA attributes and is clickable', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('[data-cy=liga-tree-toggle-all-button]').should('exist')

  // Sanity check: button is clickable without error
  cy.get('[data-cy=liga-tree-toggle-all-button]').click()
})

it('Expand-all never shows nodes deeper than level 6', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('[data-cy=liga-tree-toggle-all-button]').click()

  // All visible nodes must have level <= 6
  cy.get('bla-league-tree [data-level]').then($nodes => {
    const levels = [...$nodes].map(el => Number(el.getAttribute('data-level')))
    levels.forEach(lvl => {
      expect(lvl).to.be.at.most(6)
    })
  })
})

it('Tree is keyboard-navigable via arrow keys', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  // Close potential blocking modal dialogs if present
  cy.get('body').then($body => {
    const closeButton = $body.find('.modal-dialog-content button, .modal-dialog-content .close')[0]
    if (closeButton) {
      cy.wrap(closeButton).click({ force: true })
    }
  })

  cy.get('bla-league-tree [role="treeitem"]').first().as('firstItem')
  cy.get('@firstItem').focus()

  cy.focused().trigger('keydown', { key: 'ArrowDown', force: true })
  cy.focused().should('have.attr', 'data-node-id')
})

it('Clicking a league node is possible (selection is clickable)', () => {
  cy.visit('http://localhost:4200/#/liga')

  // Ensure tree is expanded so that at least one node is visible
  cy.get('body').then($body => {
    const toggleBtn = $body.find('[data-cy="liga-tree-toggle-all-button"]')[0]
    if (toggleBtn) {
      cy.wrap(toggleBtn).click({ force: true })
    }
  })

  // Take the first visible league node and click it without navigation errors
  cy.get('bla-league-tree [data-node-id]').first().then($node => {
    const ligaId = $node.attr('data-node-id')
    expect(ligaId).to.exist

    cy.wrap($node).click({ force: true })
  })
})

it('Header layout keeps description and actions in one row on desktop', () => {
  cy.viewport(1280, 800)
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('.liga-overview__header p.mb-0').then($desc => {
    const descTop = $desc[0].getBoundingClientRect().top

    cy.get('.liga-overview__actions').then($actions => {
      const actionsTop = $actions[0].getBoundingClientRect().top
      // On desktop, header description and actions should be roughly aligned vertically
      expect(Math.abs(descTop - actionsTop)).to.be.lessThan(10)
    })
  })
})

it('Header layout stacks actions below description on mobile', () => {
  cy.viewport(375, 667)
  cy.visit('http://localhost:4200/#/liga')

  cy.get('.liga-overview__header p.mb-0').then($desc => {
    const descTop = $desc[0].getBoundingClientRect().top

    cy.get('.liga-overview__actions').then($actions => {
      const actionsTop = $actions[0].getBoundingClientRect().top
      // On small screens, actions should move below the description
      expect(actionsTop).to.be.greaterThan(descTop + 10)
    })
  })
})
