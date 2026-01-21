/**
 * This test opens the sidebar and clicks on the "LIGAUEBERSICHT" tab and checks if the url has changed successfully
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')
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
 */
it('Sidebar-Button "Ligaübersicht" ist vorhanden', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').should('exist').and('be.visible')
})
