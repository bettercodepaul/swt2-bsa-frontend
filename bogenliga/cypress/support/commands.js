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


// Cypress.Commands.add('logout', () => {
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
  cy.get('.dropdown')
    .click()

  cy.get('.dropdown-menu > :nth-child(4)')
    .click()
}
);


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
  cy.get('#exampleModal').then(($modal) => {
    if ($modal.length > 0) {
      cy.get('button#OKBtn1.action-btn-primary').click();
    } else {
      // Log a message indicating that the modal is not found
      Cypress.log({
        name: 'Modal',
        message: 'The modal with ID "exampleModal" was not found.',
      });
    }
  });
});

