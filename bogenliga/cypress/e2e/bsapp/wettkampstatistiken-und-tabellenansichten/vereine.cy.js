describe("Vereine und Mannschaften Übersicht Tests", () => {


  it('Mannschaftsseite mit Auswahl exisitert', function () {
    cy.visit('http://localhost:4200/#/mannschaft/1/102');

    cy.get('#mannschaftSelect').should('be.ok');
    cy.get('#mannschaftSelect option')
      .last()
      .invoke('val')
      .then(value => {
        cy.get('#mannschaftSelect').select(value)
        cy.get('#mannschaftSelect')
          .find('option:selected')
          .should('have.value', value);
      });


    cy.get('button#jumpToVereinButton').should('be.ok');
    cy.get('button#jumpToVereinButton').click();
    cy.url().should('include', '/vereine/1');
  });

});
