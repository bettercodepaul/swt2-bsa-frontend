/**
 * This test opens the sidebar and clicks on the "VEREINE" tab and checks if the url has changed successfully
 */
it('Anzeige Vereine', function () {
  cy.visit('http://localhost:4200/')
  cy.wait(1000)
  cy.get('[data-cy=sidebar-vereine-button]').click({force: true})
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
});

it('Navigation von Vereine zu Verein', function () {
  cy.visit('http://localhost:4200/#/vereine');

  cy.get('#vereine-table > div > table > tbody > tr')
    .first()
    .find('td')
    .first()
    .find('span')
    .invoke('text')
    .then((mannschaftName) => {
      cy.get('#vereine-table > div > table > tbody > tr')
        .first().click();
      cy.get('h2').invoke('text').then((mannschaftHeading) => {
          expect(mannschaftHeading.trim()).to.be.eq(mannschaftName.trim());
      })
    });
});

it('Vereinsseite existiert und kann navigieren', function () {
  cy.visit('http://localhost:4200/#/vereine/1');
  cy.get('[data-cy="vereinName"]').should('eq', 'SV Schwieberdingen');
  cy.get('#mannschaftentabelle > div > table > tbody > tr').should('have.length', 1);
  cy.get('#mannschaftentabelle > div > table > tbody > tr').first().click();
  cy.url().should('include', 'vereine/1/102');
});

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

it('Mannschaftsübersicht mit Statistiken existiert', function () {
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

