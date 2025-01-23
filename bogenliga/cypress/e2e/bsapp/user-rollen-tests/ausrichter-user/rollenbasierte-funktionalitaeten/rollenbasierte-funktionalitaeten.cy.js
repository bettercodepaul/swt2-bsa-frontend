describe('testvontest', function () {
  beforeEach(() => {
    cy.wait(1000)
  })

  afterEach(() => {
    //NOTE: Preparation for next test
    cy.wait(1000)
    cy.disbandModalIfShown()
    cy.wait(1000)
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
   */
  it('Ausrichter - Homepage anzeigen', () => {
    cy.loginAusrichter()
  })


  // it('Ausrichter - Regionen anzeigen', () => {
  //   cy.get('.fa-bullseye').click();
  //   cy.get('.sunburst-viz');
  // })
  //
  // it('Ausrichter - Regionen anzeigen, über Verwaltung', () => {
  //   cy.get('.fa-cogs').click();
  //   cy.get('[data-cy=verwaltung-regionen-button]').click();
  //   cy.get('[id=payload-id-0]');
  // })
  //
  // it('Ausrichter - Verein suchen', () => {
  //   cy.get('.fa-users > path').click();
  //   cy.get('.input-group > #undefined').click();
  //   cy.get('.input-group > #undefined').type('Reutlingen');
  // })
  //
  // it('Verwaltung aufrufen', () => {
  //   cy.visit('http://localhost:4200/#/regionen');
  //   cy.get('.fa-cogs > path').click();
  // })
  //
  //
  // it('Verein suchen', () => {
  //   cy.visit('http://localhost:4200/#/regionen');
  //   cy.get('.fa-users').click();
  //   cy.get('.input-group > #undefined').click();
  //   cy.get('.input-group > #undefined').type('Kreis');
  // });
  //
  //
  // it('DSB Mitglieder Übersicht', () => {
  //   cy.visit('http://localhost:4200/#/regionen');
  //   cy.get('.fa-cogs').click();
  //   cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').click();
  // });


  //
  // it('DSB Mitglied anlegen (nur von Vereinen, die in der Veranstaltung sind, die er ausrichtet)', () => {
  //
  //   cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder');
  //   cy.get('button.action-btn-success').contains('Neu').click();
  //   cy.get('[data-cy=detail-vorname-feld]').click();
  //   cy.get('[data-cy=detail-vorname-feld]').type('TestVorname');
  //   cy.get('[data-cy=detail-nachname-feld]').type('TestNachname');
  //   cy.get('[data-cy=detail-geburtsdatum-feld]').type('1999-02-11');
  //   cy.get('[data-cy=detail-mitgliedsnummer-feld]').click();
  //   cy.get('[data-cy=detail-mitgliedsnummer-feld]').type('12345677');
  //   cy.get('[data-cy=detail-vereine-dsb]').select('0: Object');
  //   cy.get('[data-cy=detail-nationalitaet-feld]').select('Germany');
  //   cy.get('[data-cy=detail-beitrittsdatum-feld]').type('2009-03-11');
  //   cy.get('#dsbMitgliedSaveButton').should('not.be.disabled').click();
  //
  // });







  it('DSBMitglied bearbeiten', function () {
    // cy.wait(1000)
    // cy.contains('tr', 'Cypress').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    // cy.get('[data-cy=detail-vorname-feld]').click()
    // cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('CypressTest')
    // cy.get('[data-cy=detail-update-button]').click()
    // cy.wait(1000)
    // cy.get('#OKBtn1').click()
    // cy.wait(1000)
    // cy.contains('tr', 'CypressTest').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    // cy.get('[data-cy=detail-vorname-feld]').click()
    // cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('CypressTest')
    // cy.get('[data-cy=detail-update-button]').click()
    // cy.wait(2000)
    // cy.get('#OKBtn1').click()
    // cy.wait(500)
    // cy.url().should('include', '#/verwaltung/dsbmitglieder')
  });


  // it('Wettkampfklassen Übersicht', () => {
  //   cy.visit('http://localhost:4200/#/regionen');
  //   cy.get('.fa-cogs').click();
  //   cy.get('[data-cy=verwaltung-klassen-button]').click();
  //
  // });
  //
  // it('Vereine Übersicht', () => {
  //   cy.visit('http://localhost:4200/#/regionen');
  //   cy.get('[data-cy="sidebar-vereine-button"] .sidebar-link').click();
  // });
  //
  //
  //
  // it('Wettkampfergebnisse anzeigen', () => {
  //   cy.visit('http://localhost:4200/#/wettkaempfe');
  //   cy.get('[id="Table0"]');
  //
  //
  //   it('Liga Tabelle', () => {
  //     cy.visit('http://localhost:4200/#/regionen');
  //     cy.get('.fa-list-ol').click();
  //   });
  //
  //
  //   it('Wettkampfdurchführung (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     cy.visit('http://localhost:4200/#/wkdurchfuehrung');
  //     cy.get('[data-cy=bla-selection-list]').type('0: 0');
  //     cy.get('option:nth-child(1)').click();
  //     cy.get('#selectionListRegions > option:nth-child(2)').click();
  //     cy.get('bla-actionbutton:nth-child(3)').click();
  //   });
  //
  //
  //   it('Setzliste - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     cy.visit('http://localhost:4200/#/wkdurchfuehrung');
  //     cy.get('.expand-container')
  //     cy.get('[id="downloadSetzliste"]').click({force: true});
  //   });
  //
  //   it('Schusszettel- Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     cy.visit('http://localhost:4200/#/wkdurchfuehrung');
  //     cy.get('.expand-container')
  //     cy.get('[id="downloadSchusszettel"]').click({force: true});
  //   });
  //
  //   it('Bogenkontrollliste - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     cy.visit('http://localhost:4200/#/wkdurchfuehrung');
  //     cy.get('.expand-container')
  //     cy.get('[id="downloadBogenkontrollliste"]').click({force: true});
  //   });
  //
  //   it('Meldezettel - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     cy.get('.expand-container')
  //     cy.get('[id="downloadMeldezettel"]').click({force: true});
  //   });
  //
  //
  //   it('Ligatabelle (generiere Matches), Mannschaftsergebnisse eines Wettkampfs - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     //TODO, aktuell keine Einträge vorhanden
  //   });
  //
  //
  //   it('Setup Tablets (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     //TODO, Funktion ist noch nicht vollständig implementiert
  //   });
  //
  //
  //   it('Tablet-Admin (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
  //     //TODO, weil Spotterinterface/Tablet noch nicht vollständig implementiert
  //   });
  //
  //
  //   it('Wettkampfergebnisse Mannschaften anzeigen', () => {
  //     cy.visit('http://localhost:4200/#/wettkaempfe');
  //     cy.get('.fa-trophy > path').click();
  //     cy.get('#showMannschaftsstatistik > .statistik-filter-button').click({force: true});
  //     cy.get('#regionenForm').submit();
  //   });
  //
  //
  //   it('Mitglieder der Mannschaft anzeigen', () => {
  //     cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder');
  //     cy.get('#payload-id-1');
  //   });
  //
  //
  //   it('Ergebnisse eines Mannschaftsmitglieds anzeigen', () => {
  //     cy.visit('http://localhost:4200/#/wkdurchfuehrung');
  //     cy.get('.fa-trophy > path').click();
  //     cy.get('.row:nth-child(2) .form-control > div').click();
  //     cy.get('#statistiken').type('einzelstatistik');
  //     cy.get('[id="Table0"]');
  //   });
  //
  //
  // });
});


