/**
 * This test checks if the League-table is filled.
 */
it('Alle Ligen zu sehen', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-liga-button]').click()
  cy.wait(4500)
  cy.get('tbody').should('have.length.at.least', 1)
})


/**
 * This test adds a League and checks if it throughs a popup notification.
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Liga Hinzufügen mit Unterstrich', function() {
  cy.get('body').then((body) => {
    if (!body.text().includes('SWT_Liga_')) {
      cy.get('[data-cy=sidebar-verwaltung-button]').click()
      cy.get('[data-cy=verwaltung-liga-button]').click()
      cy.wait(4000)
      cy.get('tbody').should('have.length.at.least', 1)

      cy.get('[data-cy=dsb-mitglied-add-button]').click()
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-name]').type('SWT_Liga_')
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-region]').select('SWT2_Region')
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-uebergeordnet]').select('Bundesliga')
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-verantwortlicher]').select('admin@bogenliga.de')
      cy.wait(5000)

      cy.typeInIFrame("Testliga");

      cy.wait(5000)
      cy.get('[data-cy=liga-save-button]').click()
      cy.wait(5000)
      cy.get('#OKBtn1').click()
      cy.wait(5000)
      cy.get('[data-cy=sidebar-verwaltung-button]').click()
      cy.get('[data-cy=verwaltung-liga-button]').click()
      cy.wait(14000)
      cy.get('tbody').should('have.length.at.least', 1)
    }
  });
})


/**
 * This test adds a League and checks if it gets added.
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Liga Hinzufügen', function() {
  cy.get('body').then((body) => {
    if (!body.text().includes('SWTLiga')) {
      cy.get('[data-cy=dsb-mitglied-add-button]').click()
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-name]').type('SWTLiga')
      cy.wait(5000)
      cy.get('[data-cy=liga-detail-region]').select('SWT2_Region')
      cy.wait(20000)
      cy.get('[data-cy=liga-detail-uebergeordnet]').select('Bundesliga')
      cy.wait(1000)
      cy.get('[data-cy=liga-detail-verantwortlicher]').select('admin@bogenliga.de')

      cy.typeInIFrame("Testliga");

      cy.wait(1000)
      cy.get('[data-cy=liga-save-button]').click()
      cy.wait(5000)
      cy.contains('.modal-content', 'Erfolg').within(() => {
        cy.get('.modal-dialog-ok button')
          .should('contain', 'OK')
          .click();
      });
      cy.wait(15000)
      cy.get('tbody').should('contain.text', 'SWTLiga')
      cy.wait(5000)
    }
  });
})

/**
 * This test deletes a League and checks if its deleted in the table.
 */
it('Liga Löschen', function() {
  cy.wait(3000)
  cy.get('tbody').should('contain.text', 'SWTLiga')
  cy.wait(5000)
  cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
  cy.wait(5000)
  cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  cy.wait(10000)
  cy.get('tbody').should('not.contain.text', 'SWTLiga')
})
