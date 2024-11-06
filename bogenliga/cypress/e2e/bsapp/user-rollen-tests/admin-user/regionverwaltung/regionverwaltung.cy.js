/**
 * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
 * schon in neuer Struktur
 */
it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 *  This test checks if the Region-table is filled.
 */
it('Regionen Anzeigen', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-regionen-button]').click()
  cy.wait(4000)
  cy.get('tbody').should('have.length.at.least', 1)
})


/**
 * This test adds a Region and checks if it gets added.
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Region Hinzufügen', function() {
  cy.get('body').then((body) => {
    if (!body.text().includes('SWT3_Region')) {
      cy.get('[data-cy=dsb-mitglied-add-button]').click()
      cy.get('[data-cy=region-detail-name]').type('SWT3_Region')
      cy.get('[data-cy=region-detail-kuerzel]').type('SWT_R')
      cy.get('[data-cy=region-detail-typ]').select('KREIS')
      cy.wait(2000)
      cy.get('[data-cy=region-detail-uebergeordnete-region]').select(0)
      cy.wait(2000)
      cy.get('[data-cy=region-save-button]').click()
      cy.get('#OKBtn1').click()
      cy.wait(1500)
      cy.get('tbody').should('contain.text', 'SWT3_Region')
    }
  });
})

/**
 * this test changes a Region and checks if the changes worked.
 */
it('Region Ändern', function() {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(5000)
  cy.get('div > #regionenForm > .form-group > .col-sm-9 > #regionName').type('17')
  cy.get('[data-cy=region-detail-kuerzel]').type('1')
  cy.get('[data-cy=region-update-button]').click()
  cy.get('#OKBtn1').click()
  cy.wait(10000)
  cy.get('tbody').should('contain.text', 'SWT3_Region17')
})

/**
 * This test deletes a Region and checks if its deleted in the table.
 */
it('Region Löschen', function() {
  cy.get('tbody').should('contain.text', 'SWT3_Region17')
  cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
  cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  cy.wait(11000)
  cy.get('tbody').should('not.contain.text', 'SWT3_Region17')
})
