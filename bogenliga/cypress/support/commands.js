// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//https://github.com/cypress-io/cypress/issues/461#issuecomment-392070888

let LOCAL_STORAGE_MEMORY = {};


// Cypress.on('uncaught:exception', ...)
/**
 * Prevents Cypress from failing the test on uncaught exceptions.
 *
 * @param {Error} err - The uncaught exception object.
 * @param {Function} runnable - The test runnable.
 * @returns {boolean} - Returns false to prevent Cypress from failing the test.
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

// Cypress.Commands.add("saveLocalStorage", ...)
/**
 * Saves the current state of the local storage into memory.
 * This allows restoring the local storage later.
 */
Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});


// Cypress.Commands.add("restoreLocalStorage", ...)
/**
 * Restores the local storage to the previously saved state.
 * This reverts the local storage to its original state before any modifications.
 */
Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});


/**
 * Logs out the user.
 *
 * This function performs the following steps:
 * 1. Logs a message indicating that the user is being logged out.
 * 2. Clicks on the dropdown element to open the dropdown menu.
 * 3. Clicks on the fourth child element of the dropdown menu to initiate the logout process.
 */
Cypress.Commands.add('logout', () => {
  cy.log('log out user')
  // Überprüfe, ob wir eingeloggt sind (Dropdown sollte existieren)
  cy.get('body').then(($body) => {
    if ($body.find('.dropdown').length > 0) {
      // Öffne das User-Dropdown
      cy.get('.dropdown', { timeout: 10000 }).should('be.visible').click();
      // Klicke auf den Logout-Button
      cy.get('[data-cy="logout-button"]', { timeout: 5000 }).should('be.visible').click();
      cy.wait(2000);
    } else {
      cy.log('User scheint nicht eingeloggt zu sein - kein Logout nötig');
    }
  });
});


// Cypress.Commands.add('dismissModal', ...)
/**
 * Dismisses the modal with the ID 'exampleModal' if it is present.
 *
 * This custom command checks if the modal element exists on the page. If the modal is found,
 * it clicks on the button with the selector 'button#OKBtn1.action-btn-primary' to dismiss the modal.
 *
 * @example
 * cy.dismissModal();
 */
Cypress.Commands.add('dismissModal', () => {

  cy.wait(500)
  cy.get('bla-actionbutton > #OKBtn1').then(($button) => {
    if ($button.length > 0) {
      $button.click();
    } else {
      Cypress.log({
        name: 'Modal',
        message: 'The OK button was not found.'
      });
    }
  });

});

/**
 * Logs in as an admin user.
 *
 * This custom command visits the 'http://localhost:4200/#/home' URL, dismisses any modal windows present,
 * clicks the login button, and dismisses any modal windows again.
 *
 * @example
 * cy.loginAdmin();
 */
Cypress.Commands.add('loginAdmin', () => {
  cy.visit('http://localhost:4200/#/user/login');
  cy.get('[data-cy=login-als-admin-button]').click()
});

Cypress.Commands.add('disbandModalIfShown', () => {
  cy.get('#exampleModal').then(($modal) => {
    if ($modal.is(':visible')) {
      // Disband the modal
      cy.get('#OKBtn1', {timeout: 1000}).should('be.visible').then(($button) => {
        if ($button.length > 0) {
          // If the button is present and visible, click on it
          cy.get('#OKBtn1').click();
        }
      });
    }
  });
});

Cypress.Commands.add('expandWettkampfTage', () => {
  cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
  cy.wait(1000)
  cy.get('[data-cy="bla-selection-list"]').select(0)
  cy.wait(1000)
})

Cypress.Commands.add('createUserTest', (testusermail) => {
  cy.get('[data-cy="sidebar-verwaltung-button"]').click()

  cy.get('[data-cy="verwaltung-user-button"]').click();

  cy.get('button.action-btn-success').click();

  cy.get('select[data-cy="bla-selection-list"]').select('KampfrichterNachname,KampfrichterVorname No.:34563456');

  cy.get('[data-cy="username-input"]').type(testusermail);

  cy.get('[data-cy="password-input"]').type('Test123456');

  cy.get('[data-cy="verify-password-input"]').type('Test123456');


  cy.get('#userSaveButton').click();

  /*
  cy.get('.modal-dialog-header').then(() => {
    cy.get('bla-actionbutton > #OKBtn1').click();
  });*/

})

//This function requires that you are logged in as admin
Cypress.Commands.add('assignRoleToTestUser', (role, testmail) => {

  cy.contains('tr', testmail)
    .find('a[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.url().should('include', '/verwaltung/user');

  cy.get(':nth-child(3) > bla-selectionlist > [data-cy="bla-selection-list"]').select('USER');

  cy.get('#shiftLeft-right').click();

  cy.get(':nth-child(1) > bla-selectionlist > [data-cy="bla-selection-list"]').select(role);

  cy.get('#shiftLeft-left').click();

  cy.get('#userUpdateButton').click();

})

Cypress.Commands.add('deleteTestUser', (testusermail) => {

  cy.contains('tr', testusermail)
    .find('a[data-cy="TABLE.ACTIONS.DELETE"]')
    .click();

  cy.get('[ng-reflect-color="action-btn-primary"] > #undefined > .action-btn-circle').click();

})

Cypress.Commands.add('typeInIFrame', (text) => {
  const iframe = cy.get('#ligaDetail_ifr')
    .its('0.contentDocument.body')
    .should('be.visible')
    .then(cy.wrap)

  iframe.clear().type(text)
})


Cypress.Commands.add('loginUserTest', () => {

  cy.get('[data-cy="login-button"]').click();

  cy.get('input#loginEmail').type('shortcutButtonTestuser@cypressTestuser.com');

  cy.get('input#loginPassword').type('Test123456');

  cy.get('#loginButton').click({force: true});

})

Cypress.Commands.add('loginAusrichter', () => {

  cy.visit('http://localhost:4200/#/home');

  cy.get('[id=navbar]').then(($element) => {
    if($element.find('[data-cy=login-button]').length > 0){
      cy.get('[data-cy=login-button]').click();
      cy.get('#loginEmail').type('HSRT-Test2@bogenliga.de');
      cy.get('#loginPassword').type('mki4HSRT');
      cy.get('[id=loginButton]').click();
    }
  })
});

Cypress.Commands.add('LoginLigaleiter', () => {

  cy.visit('http://localhost:4200/#/home');

  // Prüft, ob das "Sitzung Abgelaufen" popup getriggered wurde
  cy.document().then((doc) => {
    const elementContainsText = Cypress.$(doc.body).find(':contains("Sitzung Abgelaufen")').length > 0;

    if (elementContainsText) {
      cy.get('#OkBtn1').click();
    }
  });

  cy.get('[id=navbar]').then(($element) => {
    if($element.find('[data-cy=login-button]').length > 0){
      cy.get('[data-cy=login-button]').click();
      cy.get('#loginEmail').type('TeamLigaleiter@bogenliga.de');
      cy.get('#loginPassword').type('swt2');
      cy.get('[id=loginButton]').click();
    }
  })
});

Cypress.Commands.add('LoginSportleiter', () => {

  cy.visit('http://localhost:4200/#/home');

  // Schließe alle offenen Modals zuerst
  cy.get('body').then($body => {
    if ($body.find('#exampleModal').length > 0 && $body.find('#exampleModal').is(':visible')) {
      cy.log('Modal gefunden, versuche es zu schließen');
      // Versuche verschiedene Möglichkeiten, das Modal zu schließen
      cy.get('#exampleModal').then($modal => {
        // Suche nach dem OK-Button im Modal
        if ($modal.find('#OKBtn1').length > 0) {
          cy.get('#OKBtn1').click();
        } else if ($modal.find('.btn-primary').length > 0) {
          cy.get('#exampleModal .btn-primary').click();
        } else if ($modal.find('.close').length > 0) {
          cy.get('#exampleModal .close').click();
        } else {
          // Als letztes Mittel: Klicke außerhalb des Modals
          cy.get('body').click(0, 0);
        }
      });
      cy.wait(1000); // Warte, bis das Modal geschlossen ist
    }
  });

  // Prüft, ob das "Sitzung Abgelaufen" popup getriggered wurde
  cy.document().then((doc) => {
    const elementContainsText = Cypress.$(doc.body).find(':contains("Sitzung Abgelaufen")').length > 0;

    if (elementContainsText) {
      cy.get('#OkBtn1').click();
    }
  });

  // Warte auf die Seite und prüfe, ob der Login-Button vorhanden ist
  cy.get('[id=navbar]', { timeout: 10000 }).then(($element) => {
    if($element.find('[data-cy=login-button]').length > 0){
      cy.get('[data-cy=login-button]').click();
      cy.get('#loginEmail').type('HSRT-Test3@bogenliga.de');
      cy.get('#loginPassword').type('mki4HSRT');
      cy.get('[id=loginButton]').click();
    }
  })
});
