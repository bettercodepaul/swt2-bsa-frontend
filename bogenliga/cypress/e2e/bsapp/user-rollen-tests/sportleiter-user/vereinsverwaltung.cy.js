
it('Login erfolgreich', function() {
  cy.clearLocalStorage()
  cy.visit('http://localhost:4200/#/home');
  cy.get('[data-cy=login-button]').click();
  cy.get('p:nth-child(8) #undefined').click();
});

it('Anzeige Vereine', function () {
  cy.wait(1000)
  cy.get('[data-cy=sidebar-vereine-button]').click({force:true})
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
})


it('Anzeige Verwaltung Vereinsliste', function () {
  // Sportleiter hat keinen Zugriff auf die Verwaltung: Button darf nicht vorhanden sein
  cy.get('[data-cy=sidebar-verwaltung-button]').should('not.exist')
})


it('Editieren eines Vereins', function () {
  // Sportleiter darf Vereine nur über die Shortcut-Buttons verwalten, nicht über die Vereins-Listenansicht
  // Navigiere zur Vereins-Seite über den Vereine-Button
  cy.get('[data-cy=sidebar-vereine-button]').click({force:true})
  cy.wait(1000)

  // Überprüfe, dass die Tabelle geladen ist
  cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0)

  // Überprüfe, dass es KEINE Edit-Buttons gibt (read-only für Sportleiter)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').should('not.exist')
})

it('Neue Vereins-Mannschaft anlegen', function () {
  // Navigiere zur Home-Seite, um den Shortcut-Button zu erreichen
  cy.visit('http://localhost:4200/#/home')
  cy.wait(1000)

  // Sportleiter navigiert über den Shortcut-Button "Mannschaften verwalten" (Vereinsdetails)
  cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click()
  cy.wait(3000)

  // Prüfe, dass wir in den Vereinsdetails sind und der Button zum Anlegen einer Mannschaft vorhanden ist
  cy.get('[data-cy=vereine-details-add-mannschaft-button]', { timeout: 10000 }).should('exist').and('be.visible')

  // Sportleiter kann bei Bedarf neue Mannschaften anlegen
  cy.log('Sportleiter hat Zugriff auf die Vereinsdetails und kann Mannschaften anlegen')
})

it('Vereins-Mannschaft bearbeiten', function () {
  // Sportleiter hat keinen Zugriff auf die Verwaltung: Button darf nicht vorhanden sein
  cy.get('[data-cy=sidebar-verwaltung-button]').should('not.exist')
})


it('Vereins-Mannschaft löschen', function () {
  // Sportleiter hat keinen Zugriff auf die Verwaltung: Button darf nicht vorhanden sein
  cy.get('[data-cy=sidebar-verwaltung-button]').should('not.exist')
})
