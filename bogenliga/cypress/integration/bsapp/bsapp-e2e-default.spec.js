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
})
