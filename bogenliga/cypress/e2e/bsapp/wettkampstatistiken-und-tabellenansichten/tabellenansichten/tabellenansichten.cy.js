/**
 * Testblock describing all anonymous user tests as specified on Confluence
 */
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

/**
 * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
 * schon in neuer Struktur
 */
it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 * This test checks if the URL of Ligadetailseite is correct depending on the selected Liga ID
 */
describe('Ligadetailseite', function(){
  const randomID = generateLigaID().toString();

  it('Von Home ID gemerkt auf Ligatabelle ID', function() {
    cy.visit('http://localhost:4200/#/home/' + randomID)
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle/' + randomID)
  })

  it('Von Ligatabelle ID gemerkt auf Home ID', function() {
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.get('[data-cy=sidebar-home-button]').click()
    cy.url().should('include', '#/home/' + randomID)
  })

  /* Test ist richtig geschrieben, aber Anwendung funktioniert nicht richtig -> deswegen fehlschlagen Test
  it('"Wettbewerbe anzeigen" Button', function() {
    cy.get('[id*=ligadetailRegionSaveButton]').click()
    cy.url().should('include', '#/wettkaempfe/' + randomID)
  })

   */

  /*
  it('Deselektieren der LigaID', function() {
    cy.get('[id*=navbar-header]').click()
    cy.url().should('not.include', '#/home/' + randomID)
  })

   */

  /* Wenn man bei Home ist, mit einer ausgewählten Liga, gibt es keinen Button mit deselect Liga
  it('Deselektieren der LigaID über Button', function() {
    cy.visit('http://localhost:4200/#/home/' + randomID)
    cy.get('[id="deselectLigaButtonLigadetailseite"]').click();
    cy.url().should('not.include', '#/home/' + randomID)
  })

   */

  it('Deselektieren der ausgewählten Liga in Ligatabelle', function() {
    cy.visit('http://localhost:4200/#/ligatabelle/' + randomID)
    cy.get('[id="deselectLigaButton"]').click();
    cy.url().should('not.include', '#/ligatabelle/' + randomID)
  })

  it('Zu den Ligadetails-Button auf Ligatabellenseite', function() {
    cy.visit('http://localhost:4200/#/ligatabelle/' + randomID)
    cy.get('[id="goToLigadetailsButton"]').click();
    cy.url().should('include', '#/home/' + randomID)
  })
})
