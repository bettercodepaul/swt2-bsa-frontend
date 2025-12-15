// Tests: Query-Fehlermeldungen + Query-Clearing (liga)

describe('Query-Fehlermeldungen + Query-Clearing (liga)', () => {

  const assertOnHomeRoute = () => {
    cy.location('hash').should('include', '#/home');
  };

  const assertLigaQueryCleared = () => {
    cy.url().should('not.contain', 'liga=');
  };

  const assertErrorDialogVisible = () => {
    cy.contains('Liga nicht gefunden').should('be.visible');
    cy.contains('Die angeforderte Liga wurde nicht gefunden.').should('be.visible');
    cy.contains('OK').should('be.visible');
  };

  const closeErrorDialog = () => {
    cy.contains('OK').click();
  };

  it('clears liga query when it is empty', () => {
    cy.visit('http://localhost:4200/#/home?liga=');

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

  it('clears liga query when it contains only whitespace', () => {
    cy.visit('http://localhost:4200/#/home?liga=%20%20%20');

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

  const interceptLiga404 = () => {
    cy.intercept(
      { method: 'GET', url: /\/v1\/liga(\/|$|\?)/ },
      {
        statusCode: 404,
        body: {
          errorCode: 'LIGA_NOT_FOUND_ERROR',
          errorMessage: 'No result found for liga',
          param: null
        }
      }
    ).as('getLiga');
  };

  const visitWithLiga = (ligaValue) => {
    cy.visit(`http://localhost:4200/#/home?liga=${encodeURIComponent(ligaValue)}`);
  };

  it('shows error dialog and clears query for invalid liga (numbers)', () => {
    interceptLiga404();
    visitWithLiga('99999');
    cy.wait('@getLiga');

    assertErrorDialogVisible();
    closeErrorDialog();

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

  it('shows error dialog for invalid liga (letters)', () => {
    interceptLiga404();
    visitWithLiga('fghjfgh');
    cy.wait('@getLiga');


    assertErrorDialogVisible();
    closeErrorDialog();

    assertOnHomeRoute();

  });

  it('shows error dialog and clears query for invalid liga (mixed)', () => {
    interceptLiga404();
    visitWithLiga('34jhfgd65');
    cy.wait('@getLiga');

    assertErrorDialogVisible();
    closeErrorDialog();

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

});

