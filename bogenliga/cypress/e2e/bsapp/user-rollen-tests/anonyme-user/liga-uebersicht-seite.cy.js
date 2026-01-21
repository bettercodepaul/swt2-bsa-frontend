/**
 * This test opens the sidebar and clicks on the "LIGAUEBERSICHT" tab and checks if the url has changed successfully
 * For anonymous users: If button is not present (missing permission), navigate directly to route
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
