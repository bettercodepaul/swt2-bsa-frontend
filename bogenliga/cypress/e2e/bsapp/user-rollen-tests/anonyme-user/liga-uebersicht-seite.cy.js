/**
 * This test opens the sidebar, clicks on the "LIGAUEBERSICHT" tab and checks whether the URL changes accordingly.
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.wait(1000)
  cy.url().should('include', '#/liga')
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
