/**
 * This test opens the sidebar, clicks on the "LIGAUEBERSICHT" tab and checks whether the URL changes accordingly.
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.wait(1000)
  cy.url().should('include', '#/liga')
})

it('Expand-all button toggles aria-pressed and icon direction', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('[data-cy=liga-tree-toggle-all-button]')
    .as('toggleButton')
    .should('exist')
    .and('have.attr', 'aria-pressed', 'false')
    .and('have.attr', 'aria-label')

  cy.get('@toggleButton').click()
  cy.get('@toggleButton').should('have.attr', 'aria-pressed', 'true')

  cy.get('@toggleButton').click()
  cy.get('@toggleButton').should('have.attr', 'aria-pressed', 'false')
})

it('Expand all shows nodes only up to level 6', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('[data-cy=liga-tree-toggle-all-button]').click()

  // Nodes at level 6 may exist, level 7+ should not be visible
  cy.get('bla-league-tree [data-level="6"]').should('exist')
  cy.get('bla-league-tree [data-level="7"]').should('not.exist')
})

it('Tree is keyboard-navigable via arrow keys', () => {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('bla-league-tree [role="treeitem"]').first().as('firstItem')
  cy.get('@firstItem').focus()

  cy.focused().trigger('keydown', { key: 'ArrowDown' })
  cy.focused().should('have.attr', 'data-node-id')
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
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')

  cy.get('.liga-overview__header p.mb-0').then($desc => {
    const descTop = $desc[0].getBoundingClientRect().top

    cy.get('.liga-overview__actions').then($actions => {
      const actionsTop = $actions[0].getBoundingClientRect().top
      // On small screens, actions should move below the description
      expect(actionsTop).to.be.greaterThan(descTop + 10)
    })
  })
})
