/**
 * shortcut-button für admin-user nicht vorhanden
 */

/**
 * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
 */
it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
 */
it('Anzeige Verwaltung', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
})

/**
 * This test tries to hoover over the "VERWALTUNG" elements
 * important: only hoover not clicking!
 * */
it('Tooltips prüfen (Hoover effekt)', function () {

  /* Hoover DSB Mitglieder */
  cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').trigger('mouseleave')
  /* Hoover Benutzer */
  cy.get('[data-cy=verwaltung-user-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-user-button]').trigger('mouseleave')
  /* Hoover Klassen */
  cy.get('[data-cy=verwaltung-klassen-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-klassen-button]').trigger('mouseleave')
  /* Hoover Vereine */
  cy.get('[data-cy=verwaltung-vereine-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-vereine-button]').trigger('mouseleave')
  /* Hoover Legen */
  cy.get('[data-cy=verwaltung-liga-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-liga-button]').trigger('mouseleave')
  /* Hoover Regionen */
  cy.get('[data-cy=verwaltung-regionen-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-regionen-button]').trigger('mouseleave')
  /* Hoover Veranstaltungen */
  cy.get('[data-cy=verwaltung-veranstaltung-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-veranstaltung-button]').trigger('mouseleave')
  /* Hoover Einstellungen */
  cy.get('[data-cy=verwaltung-einstellungen-button]').trigger('mouseenter')
  cy.get('[data-cy=verwaltung-einstellungen-button]').trigger('mouseleave')
})
/**
 * This test shows the user tab in the administration
 */
it('Anzeige User', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('[data-cy=verwaltung-user-button]').click()
  cy.url().should('include', '#/verwaltung/user')
})
