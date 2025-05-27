beforeEach(() => {
  cy.loginAdmin();
  cy.url().should('include', '#/home');
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.url().should('include', '#/verwaltung');
  cy.get('[data-cy=verwaltung-sync-button]')
    .should('be.visible')
    .and('not.be.disabled')
    .click();
  cy.url().should('include', '#/verwaltung/migration');
  cy.viewport(1920, 1080);
});

afterEach(() => {
  cy.disbandModalIfShown();
});

/*
  Diese Tests testen die Drop downs 'Zeitstempel' und 'Status'
  auf der Seite Migration http://localhost:4200/#/verwaltung/migration
 */

describe('Filter', function () {
  /*
  Drop down 'Status'
   */
  const testCases = [
    { filter: 'Erfolgreich', status: '1: Erfolgreich', urlPart: 'findSuccessed' },
    { filter: 'Laufend', status: '2: Laufend', urlPart: 'findInProgress' },
    { filter: 'Neu', status: '3: Neu', urlPart: 'findNews' },
    { filter: 'Alle', status: '4: Alle', urlPart: 'findAllWithPages' },
    { filter: 'Fehlgeschlagen', status: '0: Fehlgeschlagen', urlPart: 'findErrors', preSelect: '4: Alle' },
  ];

  testCases.forEach(({ filter, status, urlPart, preSelect }) => {
    it(`Filtern nach ${filter} Einträgen`, () => {
      if (preSelect) {
        cy.get('[data-cy=status-filter-selection]').select(preSelect); // Erst etwas anderes auswählen
      }

      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/${urlPart}?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
      }).as('filter');

      cy.get('[data-cy=status-filter-selection]').select(status);
      cy.wait('@filter');
    });
  });

  /*
  Drop down Zeitstempel
   */
  const timestampFilters = [
    { label: 'letzten drei Monate', value: '1: letzten drei Monate', urlPart: 'letzten%20drei%20Monate' },
    { label: 'letzter Monat', value: '0: letzter Monat', urlPart: 'letzter%20Monat', preSelect: '1: letzten drei Monate' },
    { label: 'letzten sechs Monate', value: '2: letzten sechs Monate', urlPart: 'letzten%20sechs%20Monate' },
    { label: 'im letzten Jahr', value: '3: im letzten Jahr', urlPart: 'im%20letzten%20Jahr' },
    { label: 'älter als ein Monat', value: '4: älter als ein Monat', urlPart: '%C3%A4lter%20als%20ein%20Monat' },
    { label: 'älter als drei Monate', value: '5: älter als drei Monate', urlPart: '%C3%A4lter%20als%20drei%20Monate' },
    { label: 'älter als sechs Monate', value: '6: älter als sechs Monate', urlPart: '%C3%A4lter%20als%20sechs%20Monate' },
    { label: 'alle', value: '7: alle', urlPart: 'alle' },
  ];

  timestampFilters.forEach(({ label, value, urlPart, preSelect }) => {
    it(`Filtern nach Zeitstempel: ${label}`, () => {
      if (preSelect) {
        // Erst muss etwas anderes etwas anderes auswählen
        cy.get('[data-cy=timestamp-filter-selection]').select(preSelect);
      }

      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=${urlPart}`,
      }).as('filter');

      cy.get('[data-cy=timestamp-filter-selection]').select(value);
      cy.wait('@filter');
    });
  });
});

