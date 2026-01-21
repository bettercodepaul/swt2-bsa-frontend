describe("Vereine und Mannschaften Übersicht Tests", () => {


  it('Mannschaftsseite mit Auswahl exisitert', function () {
    cy.visit('http://localhost:4200/#/vereine/1/102');

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

 it ('Mannschaftsübersicht mit Statistiken existiert', function () {
    cy.visit('http://localhost:4200/#/vereine/1/102');

    cy.get('#wettkampftagSelect').should('be.ok');
    cy.get('#wettkampftagSelect').select(0);

    cy.get('[data-cy=statisticTabButton]').first().click();
    cy.get('[data-cy=tableStatistik] > div > table > tbody > tr').should('have.length', 3);

    cy.get('[data-cy=statisticTabButton]').eq(1).click();
    cy.get('[data-cy=tableStatistik] > div > table > tbody > tr').should('have.length', 3);

    cy.get('[data-cy=statisticTabButton]').eq(2).click();
    cy.get('[data-cy=tableStatistik] > div > table > tbody > tr').should('have.length', 3);

    cy.get('[data-cy=statisticTabButton]').eq(3).click();
    cy.get('[data-cy=tableStatistik] > div > table > tbody > tr').should('have.length', 3);
  });

it('Vereinsseite exisitert und kann navigieren', function () {
    cy.visit('http://localhost:4200/#/vereine/1');
    cy.get('#mannschaftentabelle > div > table > tbody > tr').should('have.length', 1);
    cy.get('#mannschaftentabelle > div > table > tbody > tr').first().click();
    cy.url().should('include','vereine/1/102');
  });
});
