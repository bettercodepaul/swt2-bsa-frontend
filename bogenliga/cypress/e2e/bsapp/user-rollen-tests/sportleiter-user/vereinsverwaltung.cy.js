
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

it('Verwaltung Vereinsliste nicht sichtbar - Breadcrumb Test', function () {
  // Home besuchen und Shortcutbutton "Mannschaften verwalten" klicken
  cy.visit('http://localhost:4200/#/home');
  cy.wait(1000)
  cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click()
  cy.wait(1000)

  // Versuchen, über Breadcrumb auf "Vereine - Übersicht" zu klicken
  // Das sollte entweder nicht existieren oder nicht funktionieren
  cy.get('[data-cy="breadcrumb-vereine-uebersicht"]').should('not.exist')
})

it('Verwaltung Vereinsliste nicht sichtbar - URL Manipulation Test', function () {
  // Versuchen, direkt auf die Verwaltungsvereinsliste zuzugreifen
  cy.visit('http://localhost:4200/#/home');
  cy.wait(1000)
  cy.visit('http://localhost:4200/#/verwaltung/vereine/', { failOnStatusCode: false })
  cy.wait(1000)

  // Es sollte entweder auf eine Fehlerseite oder zurück zur Home redirected werden
  cy.url().should('not.include', '#/verwaltung/vereine')
})

it('Editieren seines Vereins', function () {

  cy.visit('http://localhost:4200/#/home');
  cy.wait(1000)

  cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click()
  cy.wait(1000)


  cy.get('[data-cy=vereine-vereinswebsite]').focus().clear()
  cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest.com')
  cy.get('[data-cy=vereine-update-button]').click()
  cy.wait(500)
  cy.get('#OKBtn1').click()
  cy.contains('http://cypresstest.com')

  cy.contains('td', '32WT525401')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.wait(1000)
  cy.get('[data-cy=vereine-vereinswebsite]').type('{selectall}{backspace}')
  cy.get('[data-cy=vereine-update-button]').click()
  cy.wait(200)
  cy.get('#OKBtn1').click()
  cy.wait(1500)
  cy.get('tr').last().find('td').eq(3).should('not.contain.value')
})

it('Neue Vereins-Mannschaft anlegen', function () {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(1000)

  cy.get('body').then((body) => {
    if (!body.text().includes('69')) {
      cy.get('[data-cy=vereine-details-add-mannschaft-button]').click()
      cy.wait(1000)
      cy.get('div > #mannschaftForm > .form-group > .col-sm-9 > #mannschaftNummer').type('69')
      cy.wait(1000)
      cy.get('#mannschaftSaveButton').click()
      cy.wait(6000)
      cy.get('#OKBtn1').click()
      cy.wait(1000)
      cy.contains('69')
    }
  });
})

it('Vereins-Mannschaft bearbeiten', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('[data-cy=verwaltung-vereine-button]').click()
  cy.url().should('include', '#/verwaltung/vereine')
  cy.wait(1000)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(500)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(9000)
  cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsnummer]').click().clear().type('76')
  cy.wait(9000)
  cy.get('[data-cy=vereine-mannschaft-detail-update-button]').click()
  cy.wait(9000)
  cy.get('#OKBtn1').click()
  cy.wait(5000)
  cy.contains('76')
})

it('Vereins-Mannschaft löschen', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('[data-cy=verwaltung-vereine-button]').click()
  cy.url().should('include', '#/verwaltung/vereine')
  cy.wait(1000)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(500)
  cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
  cy.wait(500)
  cy.get('button.action-btn-primary:contains("Ja")').click()
  cy.wait(500)
  cy.get('tbody').should('not.contain.text', '76')
  cy.wait(1000)
  cy.get('[data-cy=vereine-details-add-mannschaft-button]').click()
  cy.wait(1000)
  cy.get('div > #mannschaftForm > .form-group > .col-sm-9 > #mannschaftNummer').type('69')
  cy.wait(1000)
  cy.get('#mannschaftSaveButton').click()
  cy.wait(6000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
  cy.contains('69')
})
