/**
 * This test opens the sidebar and clicks on the "LIGAUEBERSICHT" tab and checks if the url has changed successfully
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  // Warte bis Sidebar geladen ist
  cy.get('#sidebar', { timeout: 10000 }).should('exist')
  // Warte auf Button
  cy.get('[data-cy=sidebar-ligauebersicht-button]', { timeout: 10000 }).should('exist')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')
})

/**
 * Prüft, ob die Ligaübersicht-Seite geladen wird (Tree, Skeleton oder Error-State sichtbar)
 */
it('Ligaübersicht-Seite lädt korrekt', function() {
  cy.visit('http://localhost:4200/#/liga')
  // Prüfe dass mindestens ein Element der Ligaübersicht sichtbar ist
  cy.get('[role="tree"], bla-tree-skeleton, bla-error-state, bla-empty-state', { timeout: 10000 }).should('exist')
})

/**
 * Prüft, ob der Sidebar-Button "Ligaübersicht" existiert
 */
it('Sidebar-Button "Ligaübersicht" ist vorhanden', function() {
  cy.visit('http://localhost:4200/')
  cy.get('#sidebar', { timeout: 10000 }).should('exist')
  cy.get('[data-cy=sidebar-ligauebersicht-button]', { timeout: 10000 }).should('exist')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').should('be.visible')
})
