// CAN_READ_DEFAULT
/**
 * This test displays the list of clubs.
 */
it('Anzeige Vereine', function () {
  cy.wait(1000);
  cy.get('[data-cy=sidebar-vereine-button]').click({ force: true });
  cy.wait(1000);
  cy.url().should('include', '#/vereine');
});

/**
 * This test redirects to the clubs page from the region page.
 */
it('Weiterleitung Vereinseite', function () {
  cy.get('[data-cy=sidebar-regionen-button]').click();
  cy.wait(3000);
  cy.get(':nth-child(11) > .main-arc').click({ force: true });
  cy.wait(2000);
  cy.get('#vereine > bla-selectionlist > #undefined').select(0);
  cy.wait(1000);
  cy.url().should('include', '#/vereine');
});

/**
 * This test shows the administration club list.
 */
it('Anzeige Verwaltung Vereinsliste', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.url().should('include', '#/verwaltung');
  cy.get('[data-cy=verwaltung-vereine-button]').click();
  cy.url().should('include', '#/verwaltung/vereine');
  cy.wait(1000);
  cy.get('table').find('tr').its('length').should('be.greaterThan', 0);
});

// CAN_READ_STAMMDATEN
/**
 * This test shows the "Wettkampfklassen" tab in administration.
 */
it('Anzeige Wettkampfklassen', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.get('[data-cy=verwaltung-klassen-button]').click();
  cy.url().should('include', '#/verwaltung/klassen');
});

/**
 * This test edits a "Wettkampfklasse".
 */
it('Wettkampfklasse bearbeiten', function () {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click();
  cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1973');
  cy.get('[data-cy=wettkampfklassen-update-button]').click();
  cy.get('#OKBtn1').click();
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click();
  cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1972');
  cy.get('[data-cy=wettkampfklassen-update-button]').click();
  cy.get('#OKBtn1').click();
});

/**
 * This test adds a new "Wettkampfklasse".
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline.
 */
it('Wettkampfklasse hinzufügen', function () {
  cy.get('body').then((body) => {
    if (!body.text().includes('Testfall')) {
      cy.get('button.action-btn-success').click();
      cy.get('[data-cy=wettkampfklasse-nummer]').type('69');
      cy.get('[data-cy=wettkampfklasse-name]').type('Testfall');
      cy.get('[data-cy=wettkampfklassen-jahrgang-von-button]').type('2000');
      cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1980');
      cy.get('[data-cy=wettkampfklassen-save-button]').click();
      cy.get('#OKBtn1').click();
    }
  });
});

// CAN_MODIFY_MY_ORT
/**
 * This test edits a club.
 */
it('Editieren eines Vereins', function () {
  cy.contains('td', '1111111111')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.wait(1000);
  cy.get('[data-cy=vereine-vereinswebsite]').focus().clear();
  cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest.com');
  cy.get('[data-cy=vereine-update-button]').click();
  cy.wait(500);
  cy.get('#OKBtn1').click();
  cy.contains('http://cypresstest.com');
});

/**
 * This test creates a new team for a club.
 */
it('Neue Vereins-Mannschaft anlegen', function () {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click();
  cy.wait(1000);

  cy.get('body').then((body) => {
    if (!body.text().includes('69')) {
      cy.get('[data-cy=vereine-details-add-mannschaft-button]').click();
      cy.wait(1000);
      cy.get('div > #mannschaftForm > .form-group > .col-sm-9 > #mannschaftNummer').type('69');
      cy.wait(1000);
      cy.get('#mannschaftSaveButton').click();
      cy.wait(6000);
      cy.get('#OKBtn1').click();
      cy.wait(1000);
      cy.contains('69');
    }
  });
});

// CAN_READ_WETTKAMPF
/**
 * This test checks if "Wettkampftage" has entries.
 */
it('Wettkampftage anzeigen', function() {
  cy.get('[data-cy=bla-selection-list]').select('2018');
  cy.wait(11000);
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click();
  cy.wait(5000);
  cy.get('[data-cy="wettkampftage-button"]').click();
  cy.wait(1000);
  cy.get('bla-col-layout > .col-layout > table > bla-selectionlist > #undefined').select(0);
});

/**
 * This test edits a "Wettkampftag" and checks if it was changed.
 */
it('Wettkampftage bearbeiten', function() {
  cy.get('[data-cy="wettkampftage-adresse"]').clear().type('Bahnhofstrasse 221');
  cy.get('#wettkampftagePLZ').clear().type('70197');
  cy.get('#wettkampftageOrt').clear().type('Stuttgart');
  cy.get('[data-cy="wettkampftage-update-button]').click();
  cy.wait(1000);
  cy.get('#OKBtn1').click();
});

// CAN_READ_MY_VERANSTALTUNG
/**
 * This test checks if the Event-table gets filled.
 */
it('Veranstaltungen Anzeigen', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.get('[data-cy=verwaltung-veranstaltung-button]').click();
  cy.wait(5000);
  cy.get('[data-cy=bla-selection-list]').select('2018');
  cy.wait(5000);
  cy.get('tbody').should('have.length.at.least', 1);
});

/**
 * This test edits a "Veranstaltung" and checks if it was changed.
 */
it('Veranstaltungen bearbeiten', function() {
  cy.visit('http://localhost:4200/#/verwaltung/veranstaltung');
  cy.wait(1000);
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click();
  cy.wait(1000);
  cy.get('[data-cy=veranstaltung-detail-name]').click();
  cy.get('[data-cy=veranstaltung-detail-name]').type('TTT');
  cy.get('[data-cy=veranstaltung-detail-ligaleiter-email]').type('1: Object');
  cy.get('.dialog-content > div').click();
  cy.get('#veranstaltungUpdateButton').click();
  cy.get('#OKBtn1 > #OKBtn1').click();
});
