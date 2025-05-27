/**
 * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
 * schon in neuer Struktur
 */
it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 * This test opens the sidebar, selects the "REGIONEN" section, selects an item from the list and checks if the website
 * redirected to the correct item's overview page.
 */
it('Weiterleitung Vereinseite', function () {
  cy.get('[data-cy=sidebar-regionen-button]').click()
  cy.wait(3000)
  cy.get(':nth-child(11) > .main-arc').click({force:true})
  cy.wait(2000)
  cy.get('#vereine > bla-selectionlist > #undefined').select(0)
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
})

/**
 * This test opens the sidebar and clicks on the "VEREINE" tab and checks if the url has changed successfully
 */
it('Anzeige Vereine', function () {
  cy.wait(1000)
  cy.get('[data-cy=sidebar-vereine-button]').click({force:true})
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
})

/**
 * This test opens the administration table and check whether the table has any content
 */
it('Anzeige Verwaltung Vereinsliste', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('[data-cy=verwaltung-vereine-button]').click()
  cy.url().should('include', '#/verwaltung/vereine')
  cy.wait(1000)
  cy.get('table').find('tr').its('length').should('be.greaterThan', 0)
})

/**
 * This test checks if it's possible to add a new club to the administration table successfully
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Neuen Verein anlegen', function () {
  cy.get('body').then((body) => {
    if (!body.text().includes('CypressTest')) {
      cy.get('button.action-btn-success').click()
      cy.url().should('include', '#/verwaltung/vereine/add')
      cy.wait(1000)
      cy.get('[data-cy=vereine-vereinsname]').click().type('CypressTest')
      cy.wait(1000)
      cy.get('[data-cy=vereine-vereinsnummer]').click().type('1111111111')
      cy.wait(1000)
      cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest')
      cy.wait(1000)
      cy.get('[data-cy=vereine-add-button]').click()
      cy.get('#OKBtn1').click()
      cy.wait(1000)
      cy.get('[data-cy=sidebar-verwaltung-button]').click()
      cy.url().should('include', '#/verwaltung')
      cy.get('[data-cy=verwaltung-vereine-button]').click()
      cy.url().should('include', '#/verwaltung/vereine')
      cy.get('#undefined > tbody').should('contain.text', 'CypressTest')
      cy.wait(200)
      cy.get('#undefined > tbody').should('contain.text', '1111111111')
    }
  });
})


/**
 * This test checks if it's possible to edit a club (change the website...) successfully
 */
it('Editieren eines Vereins', function () {

  cy.contains('td', '1111111111')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.wait(1000)
  cy.get('[data-cy=vereine-vereinswebsite]').focus().clear()
  cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest.com')
  cy.get('[data-cy=vereine-update-button]').click()
  cy.wait(500)
  cy.get('#OKBtn1').click()
  cy.contains('http://cypresstest.com')

  cy.contains('td', '1111111111')
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

/**
 * This test checks if it is possible to add a new team to a club successfully
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
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

/**
 * The test checks if it's possible to edit a team successfully
 * update-button is not on the Cypress Test, but in normal it is
 *Issue: Update-button is visible in production but not in Cypress,
*/
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
  cy.get('[data-cy=vereine-mannschaft-detail-update-button]').click({ force: true });

  cy.wait(9000)
  cy.get('#OKBtn1').click()
  cy.wait(5000)
  cy.contains('76')
})

/**
 * The test checks if it's possible to delete a team successfully
 */
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

/**
 * This test checks if it's possible to delete a club successfully
 */
it('Einen Verein löschen', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('[data-cy=verwaltung-vereine-button]').click()
  cy.url().should('include', '#/verwaltung/vereine')
  cy.wait(1000)
  cy.get('tbody').should('contain.text', 'CypressTest')
  cy.wait(200)
  cy.get('tbody').should('contain.text', '1111111111')
  cy.contains('td', '1111111111')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.DELETE"]')
    .click();
  cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  cy.get('tbody').should('not.contain.text', 'CypressTest')
  cy.wait(200)
  cy.get('tbody').should('not.contain.text', '1111111111')
  //cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
})
