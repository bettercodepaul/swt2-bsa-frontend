/**
 * Testblock describing all anonymous user tests as specified on Confluence
 */
describe('Anonyme User tests', function () {
  /**
   * This test opens the home page and check whether the tournament table has any content
   */
  it('Testfall 1: Home aufrufen / Wettkampftabelle gefüllt', function () {
    cy.visit('http://localhost:4200/')
    cy.url().should('include', '#/home')
  })

  /**
   * This test presses the login button on the home page and checks whether the login page opens
   */
  it('Testfall 2: Login möglich / Fenster öffnet sich', function() {
    cy.visit('http://localhost:4200/')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
  })

  /**
   * This test opens the sidebar and clicks on the "REGIONEN" tab and checks if the url has changed successfully
   */
  it('Testfall 3: Anzeige Regionen', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('REGIONEN').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/regionen')
  })

  /**
   * This test clicks on a single sunburst arc item and checks if details have loaded for the selected item
   */
  it('Testfall 4: Sunburst details anzeigen', function () {
    cy.get(':nth-child(2) > .main-arc').click()
    cy.wait(1000)
    cy.get('#details')
  })

  /**
   * This test checks if after an item has been selected the website redirected to the correct location
   */
  it('Testfall 5: Weiterleitung Ligatabelle', function () {
    cy.get('#ligen > bla-selectionlist > #undefined').select(0)
    cy.wait(2000)
    cy.url().should('include', '#/ligatabelle')
  })

  /**
   * This test opens the sidebar, selects the "REGIONEN" section, selects an item from the list and checks if the website
   * redirected to the correct item's overview page.
   */
  it('Testfall 6: Weiterleitung Vereinseite', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('REGIONEN').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.get(':nth-child(11) > .main-arc').click()
    cy.wait(2000)
    cy.get('#vereine > bla-selectionlist > #undefined').select(0)
    cy.wait(1000)
    cy.url().should('include', '#/vereine')
  })

  /**
   * This test opens the sidebar and clicks on the "VEREINE" tab and checks if the url has changed successfully
   */
  it('Testfall 7: Anzeige Vereine', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VEREINE').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/vereine')
  })

  /**
   * This test checks if after typing in a search term the list shrinks in size accordingly
   */
  it('Testfall 8: Vereinsliste Verringert sich', function() {
    cy.visit('http://localhost:4200/#/home')
    cy.get('.navbar-text > bla-sidebar-item > .sidebar-link > .ng-fa-icon > .fa-users').click()
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').click()
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').type('SV')
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list').should('have.length.at.least', 1)
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').type('X')
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list').should('have.length', 1)
  })

  /**
   * This test opens the sidebar and clicks on the "LIGATABELLE" tab and checks if the url has changed successfully
   */
  it('Testfall 9: Anzeige Ligatabelle', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('LIGATABELLE').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/ligatabelle')
  })

  /**
   * This test checks if a valid search term yields the expected results from the website
   */
  it('Testfall 10: Suchfeld Ligatabelle', function() {
    cy.get('.input-group > #undefined').type('SWT2')
    cy.wait(1000)
    cy.get('bla-selectionlist').should('contain.text', 'SWT2_Liga')
    cy.contains('SWT2_Liga').click()
  })

  /**
   * This test opens the sidebar and clicks on the "WETTKAEMPFE" tab and checks if the url has changed successfully
   */
  it('Testfall 11: Anzeige Wettkampf Ergebnisse', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('WETTKAEMPFE').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/wettkaempfe')
  })

  /**
   * This test checks if the shown results contain expected data
   */
  it('Testfall 12: Ergebnis anzeigen', function() {
    cy.wait(10000)
    cy.contains('SWT2')
    cy.wait(15000)
    cy.contains('Alle Mannschaften anzeigen').click()
    cy.contains('Wettkampftag 1')
  })

  /**
   * This test checks if the selected item of a team shows the expected data
   */
  it('Testfall 13: Ergebnis anzeigen einzelner Verein', function() {
    cy.wait(1000)
    cy.get('#vereine').select(0)
    cy.get(':nth-child(2) > #showResultsButton').click()
    cy.contains('Wettkampftag 1')
  })

  /**
   * This test selects a single statistic and checks if the required data is present
   */
  it('Testfall 14: Ergebnis anzeigen Einzelstatistik', function() {
    cy.wait(1000)
    cy.get('#vereine').select(0)
    cy.contains('Einzelstatistik anzeigen').click()
    cy.contains('Pfeilwert pro Match')
  })

  /**
   * This test selects all items from the statistics and checks if the required data is present
   */
  it('Testfall 15: Ergebnis anzeigen Gesamtstatistik', function() {
    cy.wait(1000)
    cy.get('#vereine').select(0)
    cy.contains('Gesamtstatistik anzeigen').click()
    cy.contains('Pfeilwert pro Jahr')
  })
})

/**
 * This test block describes all administrative user tests
 */
describe('Admin User tests', function() {
  /**
   * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
   */
  it('Testfall 1: Login erfolgreich', function() {
    cy.visit('http://localhost:4200/#/home')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
    cy.get('bla-alert > #undefined > p:nth-child(2) > bla-button > #undefined').click()
    cy.url().should('include', '#/home')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
   */
  it('Testfall 2: Anzeige Verwaltung', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
  })

  /**
   * This test lists all "DSBMitglieder" items and checks if the URI has been updated accordingly
   */
  it('Testfall 3: Anzeige DSBMitglieder', function() {
    cy.wait(1000)
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(1) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  })

  /**
   * This test edits a single member and checks if after editing the website redirects the user to the expected location
   */
  it('Testfall 4: Edit DSBMitglied', function() {
    cy.wait(1000)
    cy.get('#undefinedActions > .action_icon > a > .ng-fa-icon > .fa-edit > path').first().click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').focus().clear().type('SWTZweiTestLocal')
    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-button > #dsbMitgliedUpdateButton').click()
    cy.wait(1000)
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
    cy.get('#breadcrumb-container > .breadcrumb > .breadcrumb-item:nth-child(3) > a > span').click()
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  })

  /**
   * This test deletes a single member and checks if after deletion the website redirects the user to the expected location
   */
  it('Testfall 5: Löschen DSBMitglied', function() {
    cy.wait(1000)
    cy.get('#undefinedActions > .action_icon > a > .ng-fa-icon > .fa-trash > path').last().click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button:nth-child(2) > #undefined').click()
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  })

  /**
   * This test adds a new "DSB-Mitglied"
   */
  it('Testfall 6: Neues DSB-Mitglied', function() {
    cy.visit('http://localhost:4200/')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
    cy.get('bla-alert > #undefined > p:nth-child(2) > bla-button > #undefined').click()
    cy.wait(1000)

    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(1) > .card-body > .btn').click()
    cy.get('.dialog-content > .overview-dialog-header > .overview-dialog-add > .btn > span').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('MitgliedVorname')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('MitgliedNachname')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('2021-11-01')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type('12344321')
    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-button > #dsbMitgliedSaveButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
    //Nicht geschaut, ob das Mitglied in der Liste vorhanden ist
  })

  /**
   * This test adds a new "DSB-Kampfrichter"
   */
  it('Testfall 7: Neuer DSB-Kampfrichter', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(1) > .card-body > .btn').click()
    cy.get('.dialog-content > .overview-dialog-header > .overview-dialog-add > .btn > span').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('KampfrichterVorname')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('KampfrichterNachname')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('2021-11-01')
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
    cy.get('.dialog-content > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type('34563456')
    /*
    @TODO implement Kampfrichterlizenz once function is available for testing
     */
    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-button > #dsbMitgliedSaveButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })

  /**
   * This test shows the user tab in the administration
   */
  it('Testfall 8: Anzeige User', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/user')
  })

  /**
   * This test edits a user
   */
  it('Testfall 9: User bearbeiten', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/user')

    cy.get('#payload-id-7 > #undefinedActions > .action_icon > a > .ng-fa-icon > .fa-edit').click()
    cy.get('bla-double-selectionlist > bla-col-layout > .col-layout > bla-selectionlist > #left').select('0: 1')
    cy.get('bla-col-layout > .col-layout > bla-selectionlist > #left > option:nth-child(1)').click()
    cy.get('.col-layout > .shift-buttons > .shift-button > bla-button > #shiftLeft-left').click()
    cy.get('#userForm > .form-group > .col-sm-9 > bla-button > #userUpdateButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })

  /**
   * This test deletes a user
   */
  /*
    it('Testfall 10: User löschen', function() {
      cy.get('#sidebarCollapseBottom').click()
      cy.contains('VERWALTUNG').click()
      cy.get('#sidebarCollapseBottom').click()
      cy.url().should('include', '#/verwaltung')
      cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
      cy.url().should('include', '#/verwaltung/user')

      //löschen von Nicholas Corle - Moderator
      cy.get('#payload-id-4 > #undefinedActions > .action_icon > a > .ng-fa-icon > .fa-trash > path').click()
      cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button:nth-child(2) > #undefined').click()
    })
  */

  /**
   * This test adds a new user
   */
  it('Testfall 11: User hinzufügen', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/user')

    cy.get('.dialog-content > .overview-dialog-header > .overview-dialog-add > .btn > span').click()
    cy.get('.col-sm-9 > #userDsbMitglied > .quicksearch-list > .quicksearch-list-select > #selectionListRegions').select('3: 32')
    cy.get('#userDsbMitglied > .quicksearch-list > .quicksearch-list-select > #selectionListRegions > option:nth-child(4)').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userUsername').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userUsername').type('testtest@bogenliga.de')
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userPassword').type('Testfall1')
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userVerifyPassword').type('Testfall1')
    cy.get('#userNeuForm > .form-group > .col-sm-9 > bla-button > #userSaveButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })

  /**
   * This test adds a new user with two-factor-authentication
   */
  it('Testfall 12: User mit 2 Faktor Authentifizierung', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/user')

    cy.get('.dialog-content > .overview-dialog-header > .overview-dialog-add > .btn > span').click()
    cy.get('.col-sm-9 > #userDsbMitglied > .quicksearch-list > .quicksearch-list-select > #selectionListRegions').select('7: 45')
    cy.get('#userDsbMitglied > .quicksearch-list > .quicksearch-list-select > #selectionListRegions > option:nth-child(8)').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userUsername').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userUsername').type('zweifaktorauthentifizierung@bogenliga.de')
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userPassword').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userPassword').type('2FaktorAuthentifizierung1')
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userVerifyPassword').click()
    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-9 > #userVerifyPassword').type('2FaktorAuthentifizierung1')

    cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-1 > #user2FA').click()
    // cy.get('.dialog-content > #userNeuForm > .form-group > .col-sm-1 > #user2FA').check('on')
    cy.get('#userNeuForm > .form-group > .col-sm-9 > bla-button > #userSaveButton').click()
    cy.get('.modal-content > .modal-footer > bla-button > #undefined > span').click()

    //check login - man erkennt nicht ob es funktioniert
    cy.visit('http://localhost:4200/')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
    cy.get('.card-body > #loginForm > .container > .form-group > #loginEmail').click()
    cy.get('.card-body > #loginForm > .container > .form-group > #loginEmail').type('zweifaktorauthentifizierung@bogenliga.de')
    cy.get('.card-body > #loginForm > .container > .form-group > #loginPassword').type('2FaktorAuthentifizierung1')
    cy.get('.card-body > #loginForm > .container > bla-button > #loginButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })

  /**
   * This test shows the "Wettkampfklassen" tab in administration
   */
  it('Testfall 13: Anzeige Wettkampfklassen', function () {
    cy.visit('http://localhost:4200/')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
    cy.get('bla-alert > #undefined > p:nth-child(2) > bla-button > #undefined').click()
    cy.wait(1000)

    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(3) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/klassen')
  })

  /**
   * This test edits a "Wettkampfklasse"
   */
  it('Testfall 14: Wettkampfklasse bearbeiten', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(3) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/klassen')

    cy.get('#payload-id-1 > #undefinedActions > .action_icon > a > .ng-fa-icon > .svg-inline--fa').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMax').click()

    //das updaten auf 1973 geht irgendwie nicht
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMax').type('1973')

    cy.get('#wettkampfKlasseForm > .form-group > .col-sm-8 > bla-button > #wettkampfKlasseUpdateButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })

  /**
   * This test adds a new "Wettkampfklasse"
   */
  it('Testfall 15: Wettkampfklasse hinzufügen', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VERWALTUNG').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('bla-grid-layout > .grid-layout > .card:nth-child(3) > .card-body > .btn').click()
    cy.url().should('include', '#/verwaltung/klassen')

    cy.get('.dialog-content > .overview-dialog-header > .overview-dialog-add > .btn > span').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseNr').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseNr').type('69')
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseName').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseName').type('Testfall')
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMin').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMin').type('1900')
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMax').click()
    cy.get('.dialog-content > #wettkampfKlasseForm > .form-group > .col-sm-8 > #wettkampfKlasseJahrgangMax').type('2000')
    cy.get('#wettkampfKlasseForm > .form-group > .col-sm-8 > bla-button > #wettkampfKlasseSaveButton').click()
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-button > #undefined').click()
  })
})
