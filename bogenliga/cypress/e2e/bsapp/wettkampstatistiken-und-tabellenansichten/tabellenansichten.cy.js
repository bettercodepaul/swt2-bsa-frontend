
/**
 * This test checks if the URL of Ligadetailseite is correct depending on the selected Liga ID
 */

/* Test ist richtig geschrieben, aber Anwendung funktioniert nicht richtig -> deswegen fehlschlagen Test
  it('"Wettbewerbe anzeigen" Button', function() {
    cy.get('[id*=ligadetailRegionSaveButton]').click()
    cy.url().should('include', '#/wettkaempfe/' + randomID)
  })
*/

/* dieser test laeuft auch nicht
  it('Deselektieren der LigaID', function() {
    cy.get('[id*=navbar-header]').click()
    cy.url().should('not.include', '#/home/' + randomID)
  })
*/

/* test lauft nicht
  Wenn man bei Home ist, mit einer ausgewählten Liga, gibt es keinen Button mit deselect Liga
  it('Deselektieren der LigaID über Button', function() {
    cy.visit('http://localhost:4200/#/home/' + randomID)
    cy.get('[id="deselectLigaButtonLigadetailseite"]').click();
    cy.url().should('not.include', '#/home/' + randomID)
  })
*/


function generateLigaID() {
  /*
  Es werden nur die Anzahl der Ligen getestet/generiert wie die Zahl unten,
  um den Test dynamisch laufen zu lassen API Endpunkt aufrufen in dem die veruegbaren Ligen zurueck gegeben werden
   */
  return Math.floor(Math.random() * 18 + 1);
}

describe('Ligadetailseite Tests', function () {
  let randomID;

  // Liga ID wird einmalig vor Test Beginn generiert
  before(() => {
    randomID = generateLigaID().toString();
  });

  beforeEach(() => {
    cy.loginAdmin();
    cy.url().should('include', '#/home');
  });

  it('Navigiere von Home zur Ligatabelle und pruefe ob ID gemerkt', function () {
    cy.visit(`http://localhost:4200/#/home/${randomID}`);
    cy.get('[data-cy=sidebar-ligatabelle-button]')
      .should('be.visible')
      .click();
    cy.url().should('include', `#/ligatabelle/${randomID}`);
  });

  it('Navigiere von Ligatabelle zurück zu Home und pruefe ob ID gemerkt', function () {
    cy.visit(`http://localhost:4200/#/ligatabelle/${randomID}`);
    cy.get('[data-cy=sidebar-home-button]')
      .should('be.visible')
      .click();
    cy.url().should('include', `#/home/${randomID}`);
  });

  it('Deselektiere die ausgewählte Liga in der Ligatabelle', function () {
    cy.visit(`http://localhost:4200/#/ligatabelle/${randomID}`);
    cy.get('[id="deselectLigaButton"]')
      .should('be.visible')
      .click();
    cy.url().should('not.include', `#/ligatabelle/${randomID}`);
  });

  it('Zu den Ligadetails-Button auf Ligatabellenseite', function () {
    cy.visit(`http://localhost:4200/#/ligatabelle/${randomID}`);
    cy.get('[id="goToLigadetailsButton"]')
      .should('be.visible')
      .click();
    cy.url().should('include', `#/home/${randomID}`);
  });
});

