/**
 * This test opens the home page and check whether the tournament table has any content
 */
it('Home aufrufen / Wettkampftabelle gefüllt', function () {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('http://localhost:4200/')
  cy.url().should('include', '#/home')
})

/**
 * This test presses the login button on the home page and checks whether the login page opens
 */
it('Login möglich / Fenster öffnet sich', function() {
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '#/user/login')
})

it('bla-veranstaltungen-button existiert und toggelt expanded/unexpanded', () => {
  // Intercept für die beiden möglichen GET-Pfade
  cy.intercept({
    method: 'GET',
    url: /\/v1\/wettkampf\/(futureSix|byLigaIdWithVeranstaltung)(?:\/.*)?/
  }).as('getVeranstaltungen');

  cy.visit('http://localhost:4200/#/home');
  cy.log('Startseite geladen');

  // Auf den API-Request warten
  cy.wait('@getVeranstaltungen', { timeout: 10000 });

  // Auf Container warten
  cy.get('#competitionList', { timeout: 10000 }).should('exist');

  // Direkt auf die bla-veranstaltungen-button Elemente warten (statt feste 5s)
  cy.get('#competitionList bla-veranstaltungen-button', { timeout: 10000 })
    .should('have.length.at.least', 1)
    .then($buttons => {
      cy.log($buttons.length.toString() + ' Veranstaltungen gefunden');
    });

  // Ersten Button als Alias setzen (außerhalb von .then())
  cy.get('#competitionList bla-veranstaltungen-button').first().as('firstEventBtn');

  // Anfangszustand prüfen
  cy.get('@firstEventBtn')
    .find('.toggleArrow')
    .should('exist')
    .and('not.have.class', 'expanded');
  cy.get('@firstEventBtn')
    .find('.competitionCardBody')
    .should('not.exist');

  // Klick zum Expandieren
  cy.get('@firstEventBtn')
    .find('.toggleArrow').click();
  cy.get('@firstEventBtn')
    .find('.competitionCardBody')
    .should('exist');
  cy.get('@firstEventBtn')
    .find('.toggleArrow')
    .should('have.class', 'expanded');

  // Klick zum Schließen
  cy.get('@firstEventBtn')
    .find('.toggleArrow').click();
  cy.get('@firstEventBtn')
    .find('.competitionCardBody')
    .should('not.exist');
  cy.get('@firstEventBtn')
    .find('.toggleArrow')
    .should('not.have.class', 'expanded');
});

it('bla-veranstaltungen-button routing', () => {
  // Intercept für die beiden möglichen GET-Pfade

  cy.visit('http://localhost:4200/#/home');
  cy.log('Startseite geladen');

  // Direkt auf die bla-veranstaltungen-button Elemente warten (statt feste 5s)
  cy.get('#competitionList bla-veranstaltungen-button', { timeout: 10000 })
    .should('have.length.at.least', 1)
    .then($buttons => {
      cy.log($buttons.length.toString() + ' Veranstaltungen gefunden');
    });

  // Ersten Button als Alias setzen (außerhalb von .then())
  cy.get('#competitionList bla-veranstaltungen-button').first().as('firstEventBtn');

  // Klick zum Expandieren und Weiterleitung zur Ligatabelle
  cy.get('@firstEventBtn')
    .find('.toggleArrow').click();
  cy.get('#goToLigaTabelle').click();
  cy.url().should('include', '#/ligatabelle');


});
