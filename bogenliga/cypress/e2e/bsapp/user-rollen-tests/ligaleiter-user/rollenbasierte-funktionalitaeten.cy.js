//alt
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

//alt
function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

describe('Ligaleiter User Tests', function() {

  it("Login Ligaleiter", () => {
    cy.LoginLigaleiter();
  })

  it("Benutzer anzeigen", () => {
    cy.visit('http://localhost:4200/#/verwaltung/user');
    cy.get('#payload-id-1');
  })

  it("Benutzer anlegen", () => {
    cy.visit('http://localhost:4200/#/verwaltung/user');
    cy.get('[routerlink="add"]').click();
    cy.get('[data-cy=username-input]').click();
  })

  it("Wettkampfklassen Übersicht", () => {
    cy.visit('http://localhost:4200/#/verwaltung/klassen');
    cy.get('.table-responsive');
  })

  it("Wettkampfklassen editieren (nicht)", () => {
    cy.visit('http://localhost:4200/#/verwaltung/klassen');
    cy.get('#payload-id-0 > #undefinedActions .svg-inline--fa').click();
    cy.get('.table-responsive'); //if table is still visible, that means the edit click failed, which complies with the permission
  })

  it("Wettkampfklasse neu anlegen (nicht)", () => {
    cy.visit('http://localhost:4200/#/verwaltung/klassen/add');
    cy.wait(50);
    cy.get('.table-responsive');
  })

  it("Vereine Übersicht", () => {
    cy.visit('http://localhost:4200/#/verwaltung/vereine');
    cy.get('.table-responsive');
  })

  it("Verein bearbeiten", () => {
    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder/');
    cy.get('#payload-id-1 > #undefinedActions [data-cy="TABLE.ACTIONS.EDIT"] path').click(); //testet Vereinsmitglied, das nicht bearbeitet werden kann
    cy.get('#OKBtn1').click();
    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder/28'); //testet Vereinsmitglied, das bearbeitet werden kann
    cy.get('#dsbMitgliedForm');
  })

  it("Mannschaftsmitglied löschen", () => {
    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder/');
    cy.get('#payload-id-1 > #undefinedActions [data-cy="TABLE.ACTIONS.DELETE"] path').click();
    cy.get('#OKBtn1').click();
  })

  it("Manschaftsmitglied hinzufügen", () => {
    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder/');
    cy.get('[ng-reflect-ng-class="action-btn-success"]').click();
    cy.get('#dsbMitgliedForm');
  })


  // Verein nicht anlegbar.
  // it("Verein anlegen", () => {
  //   cy.visit('http://localhost:4200/#/verwaltung/vereine/add');
  // })
  //
  // it("Verein löschen", () => {
  //   cy.visit('http://localhost:4200/#/verwaltung/vereine');
  // })
  //
  // it("Verein Mannschaft anlegen ", () => {
  // })
  //
  // it("Verein Manschaft löschen", () => {
  // })

  it("Liga Übersicht", () => {
    cy.visit('http://localhost:4200/#/verwaltung/liga');
    cy.get('.overview-dialog-content');
  })

  // it("Liga anlegen", () => {
  // })
  //
  // it("Liga bearbeiten", () => {
  // })
  //
  // it("Liga löschen", () => {
  // })

  // it("Regionen Übersicht", () => {
  // })

  // it("Regionen anlegen", () => {
  //   cy.visit('http://localhost:4200/#/verwaltung/regionen');
  // })
  //
  // it("Regionen löschen", () => {
  // })
  //
  // it("Regionen bearbeiten", () => {
  // })


  //TODO: Veranstaltungs funktionen Tests/restliche Funktionen & Berechtigungen
})
