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
    cy.visit('http://localhost:4200/#/home');
    cy.get('.fa-home').click();
    cy.get('#navbar-header > h1').click();
    cy.get('.fa-home > path').click();

  })


  it('Ausrichter - Regionen anzeigen' , () => {
    cy.visit('http://localhost:4200/#/home');
    cy.get('.fa-bullseye > path').click();
  })


  it('Ausrichter - Regionen anzeigen, über Verwaltung' , () => {
  cy.visit('http://localhost:4200/#/regionen');
  cy.get('.fa-cogs').click();
  cy.get('[data-cy=verwaltung-regionen-button]').click();
})

  it('Ausrichter - Verein suchen', () => {
  cy.get('.fa-users > path').click();
  cy.get('.input-group > #undefined').click();
  cy.get('.input-group > #undefined').type('Reutlingen');
})

  it('Verwaltung aufrufen', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('.fa-cogs > path').click();
  })


  it('Verein suchen', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('.fa-users').click();
    cy.get('.input-group > #undefined').click();
    cy.get('.input-group > #undefined').type('Kreis');
  });



  it('DSB Mitglieder Übersicht', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('.fa-cogs').click();
    cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').click();
  });




  it('DSB Mitglied bearbeiten (nur von Vereinen, die in der Veranstaltung sind, die er ausrichtet)', () => {
    cy.wait(1000)
    cy.contains('tr', 'vorname').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    cy.get('[data-cy=detail-vorname-feld]').click()
    cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocalBitte')
    cy.get('[data-cy=detail-update-button]').click()
    cy.wait(1000)
    cy.get('#OKBtn1').click()
    cy.wait(1000)
    cy.contains('tr', 'SWTZweiTestLocalBitte').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    cy.get('[data-cy=detail-vorname-feld]').click()
    cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocal')
    cy.get('[data-cy=detail-update-button]').click()
    cy.wait(2000)
    cy.get('#OKBtn1').click()
    cy.wait(500)
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  });


  it('DSB Mitglied anlegen (nur von Vereinen, die in der Veranstaltung sind, die er ausrichtet)', () => {
    const randomID = generateID().toString();

    cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('vorname')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('nachname')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('1996-02-01')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type(randomID);
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').select('BSC Stuttgart')
    cy.get('[data-cy=detail-beitrittsdatum-feld]').click();
    cy.get('[data-cy=detail-beitrittsdatum-feld]').type('2001-02-02');

    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedSaveButton').click()
    cy.wait(3000)
    cy.get('#OKBtn1').click()
    cy.wait(1000)
  });


  it('Wettkampfklassen Übersicht', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('.fa-cogs').click();
    cy.get('[data-cy=verwaltung-klassen-button]').click();

  });

  it('Vereine Übersicht', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('[data-cy="sidebar-vereine-button"] .sidebar-link').click();
  });


  it('Mannschaftsmitglied hinzufügen', () => {
      // TODO, aber aktuell fehlt Button für Rolle des Ausrichters
  });


  it('Wettkampfergebnisse anzeigen', () => {
    cy.visit('http://localhost:4200/#/home');
    cy.get('.fa-trophy > path').click();
    cy.get('#showMannschaftsstatistik > .statistik-filter-button').click();
    cy.get('#regionenForm').submit();
    cy.get('#mannschaftsStatistiken').click();
    cy.get('#mannschaftsStatistiken').type('alle_mannschaften');
    cy.get('#mannschaftsStatistiken').click();
    cy.get('#mannschaftsStatistiken').click();
    cy.get('#mannschaftsStatistiken').type('tabellenverlauf_statistik_wettkampftage');
    cy.get('#mannschaftsStatistiken').click();
    cy.get('#mannschaftsStatistiken').type('tabellenverlauf_statistik_alle_sportjahre');
    cy.get('.active:nth-child(1)').click();
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('einzelstatistik');
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('schuetzenstatistikMatch');
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('schuetzenstatistikWettkampftage');
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('letztejahre');
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('einzelstatistik');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('1: Object');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('2: Object');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('3: Object');
    cy.get('#wettkampftage').click();
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('schuetzenstatistikMatch');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('1: Object');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('2: Object');
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').click();
    cy.get('#wettkampftage').type('3: Object');
    cy.get('#wettkampftage').click();
    cy.get('#statistiken').click();
  });


  it('Liga Tabelle', () => {
    cy.visit('http://localhost:4200/#/regionen');
    cy.get('.fa-list-ol').click();
  });



  it('Wettkampfdurchführung (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
    cy.visit('http://localhost:4200/#/home');
    cy.get('.fa-calendar > path').click();
    cy.get('[data-cy=bla-selection-list]').type('0: 0');
    cy.get('option:nth-child(1)').click();
    cy.get('#payload-id-30 > #undefinedActions .action-btn-circle').click();
    cy.get('#wettkampfDurchfuehrung').click();
  });


  it('Setzliste - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {

    cy.visit('http://localhost:4200/#/home');
    cy.get('bla-expand:nth-child(1) .expand-icon').click();
    cy.get('option:nth-child(1)').click();
    cy.get('#downloadSetzliste').click();


  });

  it('Schusszettel- Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {

    cy.visit('http://localhost:4200/#/home');
    cy.get('bla-expand:nth-child(1) .expand-icon').click();
    cy.get('option:nth-child(1)').click();
    cy.get('#downloadSchusszettel').click();

  });
  it('Bogenkontrollliste - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {

    cy.visit('http://localhost:4200/#/home');
    cy.get('bla-expand:nth-child(1) .expand-icon').click();
    cy.get('option:nth-child(1)').click();
    cy.get('#downloadBogenkontrollliste').click();


  });
  it('Meldezettel - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {

    cy.visit('http://localhost:4200/#/home');
    cy.get('bla-expand:nth-child(1) .expand-icon').click();
    cy.get('option:nth-child(1)').click();
    cy.get('#downloadMeldezettel').click();

  });


  it('Ligatabelle (generiere Matches), Mannschaftsergebnisse eines Wettkampfs - Dokumente erstellen (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
    //TODO, aktuell keine Einträge vorhanden
  });


  it('Setup Tablets (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
    //TODO, weil Spotterinterface/Tablet noch nicht vollständig implementiert
  });


  it('Tablet-Admin (x - nur die eigene, für den Wettkampftag, wo er Ausrichter ist)', () => {
    //TODO, weil Spotterinterface/Tablet noch nicht vollständig implementiert
  });


  it('Wettkampfergebnisse Mannschaften anzeigen', () => {
    cy.visit('http://localhost:4200/#/home');
    cy.get('[data-cy=sidebar-wettkampf-button]').click();
    cy.get('#showMannschaftsstatistik > .statistik-filter-button').click();
    cy.get('#regionenForm').submit();

  });

  it('Mitglieder der Mannschaft anzeigen', () => {
    cy.wait(1000)
    cy.contains('tr', 'vorname').find('[data-cy="TABLE.ACTIONS.VIEW"]').click();
    cy.wait(1000)
    cy.get('[data-cy=detail-beitrittsdatum-feld]').invoke('attr', 'readonly')
      .should('exist');
    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder');
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  });


  it('Ergebnisse eines Mannschaftsmitglieds anzeigen', () => {
    cy.visit('http://localhost:4200/#/home');
    cy.get('#statistiken').click();
    cy.get('#statistiken').type('einzelstatistik');

  });



})


