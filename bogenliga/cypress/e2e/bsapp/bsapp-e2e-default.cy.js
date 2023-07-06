/**
 * Testblock describing all anonymous user tests as specified on Confluence
 */
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

describe('Anonyme User tests', function () {
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

  /**
   * This test opens the sidebar and clicks on the "REGIONEN" tab and checks if the url has changed successfully
   */
  it('Anzeige Regionen', function() {
    cy.get('[data-cy=sidebar-regionen-button]').click()
    cy.url().should('include', '#/regionen')
  })

  /*Test hilfeicon */
  it('test hilfeicon', function() {
    cy.visit('http://localhost:4200/')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '#/user/login')
    cy.get('[data-cy=sidebar-regionen-button]').click();
    cy.get('bla-hilfe-button a')
      .should('have.attr', 'href', 'https://wiki.bsapp.de/doku.php?id=liga:regionen')
      .should('have.attr', 'target', '_blank');
  })

  /**
   * This test clicks on a single sunburst arc item and checks if details have loaded for the selected item
   */
  it('Sunburst details anzeigen', function () {
    cy.get('[data-cy=sidebar-regionen-button]').click();
    cy.wait(1000)
    cy.get(':nth-child(2) > .main-arc').click({force:true})
    cy.wait(1000)
    cy.get('#details')
    cy.get('[data-cy=sidebar-regionen-button]').click()
    cy.wait(1000)
  })
  /**
   * This test checks if after an item has been selected the website redirected to the correct location
   */
  it('Weiterleitung Ligatabelle', function () {
    cy.wait(6000)
    cy.get('#ligen > bla-selectionlist > #undefined').select(0)
    cy.wait(1000)
    cy.url().should('include', '#/ligatabelle')
  })

  /**
   * This test opens the sidebar, selects the "REGIONEN" section, selects an item from the list and checks if the website
   * redirected to the correct item's overview page.
   */
  it('Weiterleitung Vereinseite', function () {
    cy.get('[data-cy=sidebar-regionen-button]').click()
    cy.wait(3000)
    cy.get(':nth-child(11) > .main-arc').click({force:true})
    cy.wait(2000)
    cy.get('#vereine > bla-selectionlist > #undefined').select(0)
    cy.wait(1000)
    cy.url().should('include', '#/vereine')
  })

  /**
   * This test opens the sidebar and clicks on the "VEREINE" tab and checks if the url has changed successfully
   */
  it('Anzeige Vereine', function () {
    cy.wait(1000)
    cy.get('[data-cy=sidebar-vereine-button]').click({force:true})
    cy.wait(1000)
    cy.url().should('include', '#/vereine')
  })

  /**
   * This test checks if after typing in a search term the list shrinks in size accordingly
   */
  it('Vereinsliste Verringert sich', function() {
    cy.wait(1000)
    cy.get('[data-cy=quicksearch-suchfeld]').click({force:true}).type('SV')
    cy.wait(1000)
    cy.get('[data-cy=quicksearch-liste]').should('have.length.at.least', 1)
    cy.wait(1000)
    cy.get('[data-cy=quicksearch-suchfeld]').click({force:true}).type('X')
    cy.wait(1000)
    cy.get('[data-cy=quicksearch-liste]').should('have.length', 1)
  })

  /**
   * This test opens the sidebar and clicks on the "LIGATABELLE" tab and checks if the url has changed successfully
   */
  it('Anzeige Ligatabelle', function () {
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle')
  })

  /**
   * This test checks if a valid search term yields the expected results from the website
   */
  it('Suchfeld Ligatabelle', function() {
    cy.wait(6000)
    cy.get('[data-cy=quicksearch-suchfeld]').click().type('Württemberg')
    cy.wait(1000)
    cy.get('[data-cy=quicksearch-liste]').should('contain.text', 'Recurve')
    cy.wait(1000)
    cy.contains('Württembergliga Recurve').click()
  })

  /**
   * This test opens the sidebar and clicks on the "WETTKAEMPFE" tab and checks if the url has changed successfully
   */
  it('Anzeige Wettkampf Ergebnisse', function() {
    cy.get('[data-cy=sidebar-wettkampf-button]').click()
    cy.url().should('include', '#/wettkaempfe')
  })

  /**
   * This test checks if the shown results contain expected data
   */
  it('Ergebnis anzeigen', function() {
    cy.wait(10000)
    cy.contains('Würtembergliga')
    cy.wait(3000)
    cy.get('[data-cy=alle-mannschaften-anzeigen-button]').click()
    cy.contains('Wettkampftag 1')
  })

  /**
   * This test checks if the selected item of a team shows the expected data
   */
  it('Ergebnis anzeigen einzelner Verein', function() {
    cy.wait(1000)
    cy.get('#vereine').select(0)
    cy.get('[data-cy=alle-mannschaften-anzeigen-button]').click()
    cy.contains('Wettkampftag 1')
  })

  /**
   * This test selects a single statistic and checks if the required data is present
   */
  it('Ergebnis anzeigen Einzelstatistik', function() {
    cy.get('[data-cy=einzelstatistik-anzeigen-button]').click()
    cy.contains('Pfeilwert pro Match')
  })

  /**
   * This test selects all items from the statistics and checks if the required data is present
   */
  it('Ergebnis anzeigen Gesamtstatistik', function() {
    cy.get('[data-cy=einzelstatistik-gesamt-anzeigen-button]').click()
    cy.contains('Pfeilwert pro Jahr')
  })

  /**
   * This test opens the sidebar and clicks on the "HILFE" tab and checks if
   * the url has changed successfully
   */
  it('Hilfeseite aufrufen', function () {
    cy.get('[data-cy=sidebar-hilfe-button]').click()
    cy.url().should('include', '#/hilfe')
  })

  /*
    * This Test selects the "Startseite" in the Section and checks if
    * the iframe is shown/displays the right content
    * **/
  it('Startseite auswählen', function () {
    cy.get('[data-cy=test-startseite]').click()
    cy  /*check if the iframe invokes the correct URL */
      .get('iframe')
      .invoke('attr', 'src')
      .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:startseite')
  })

  /**
   * This Test selects the "Arbeitsablauf als Ligaleiter" section and checks if
   * the iframe is shown/displays the right content
   * */
  it('Ablauf als Ligaleiter auswählen', function () {
    cy.get('[data-cy=test-ligaleiter]').click()
    cy  /*check if the iframe invokes the correct URL */
      .get('iframe')
      .invoke('attr', 'src')
      .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:arbeitsablauf')
  })

  /**
   * This Test selects the "Arbeitsablauf als Wettkampfdurchführung" section and checks if
   * the iframe is shown/displays the right content
   * */
  it('Wettkampfdurchführung auswählen', function () {
    cy.get('[data-cy=test-wkd]').click()
    cy  /*check if the iframe invokes the correct URL */
      .get('iframe')
      .invoke('attr', 'src')
      .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung')
  })
})

describe('Admin User tests', function() {

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
   * This test lists all "DSBMitglieder" items and checks if the URI has been updated accordingly
   */
  it('Anzeige DSBMitglieder', function() {
    cy.wait(1000)
    cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').click()
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
  })

  /**
   * This test adds a new "DSB-Mitglied"
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Neues DSB-Mitglied', function() {
    //cy.get('body').then((body) => {
    //if (!body.text().includes('MitgliedVorname')) {
    const randomID = generateID().toString();

    cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('vorname')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('nachname')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('1996-02-01')
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type(randomID);
    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').select('BSC Stuttgart')
    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedSaveButton').click()
    cy.wait(3000)
    //cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton > #undefined').click()
    cy.get('#OKBtn1').click()
    cy.wait(1000)
  });

  /*
  describe('test_name', function() {

 it('what_it_does', function() {

    cy.viewport(1259, 896)

    cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder')

    cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('vorname')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('nachname')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('0001-02-01')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('0019-02-01')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('0199-02-01')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('1996-02-01')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type('1234567')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').click()

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').select('13: Object')

    cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').click()

    cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedSaveButton').click()

    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton > #undefined').click()

 })

})

   */

  /**
   * This test edits a single member and checks if after editing the website redirects the user to the expected location
   */
  it('Edit DSBMitglied', function() {

    cy.wait(1000)
    //cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
    cy.contains('tr', 'vorname').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    cy.get('[data-cy=detail-vorname-feld]').click()
    cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocalBitte')
    cy.get('[data-cy=detail-update-button]').click()
    cy.wait(1000)
    cy.get('#OKBtn1').click()
    cy.wait(1000)
    cy.contains('tr', 'SWTZweiTestLocalBitte').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
    cy.get('[data-cy=detail-vorname-feld]').click()
    cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocal')
    cy.get('[data-cy=detail-update-button]').click()
    cy.wait(2000)
    //cy.get('#OKBtn1').click()
    //cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedUpdateButton').click()
    //cy.get('bla-actionbutton > #undefined > .action-btn-circle > .ng-fa-icon > .fa-check').click()
    //cy.get('.modal-dialog > .modal-content > .modal-footer.modal-dialog.ok > bla-actionbutton > #undefined').click()
    //cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton > #undefined').click()
    cy.get('#OKBtn1').click()
    cy.wait(500)
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
    //document.querySelector("#exampleModal > div > div > div.modal-footer.modal-dialog-ok > bla-actionbutton")
    ////*[@id="exampleModal"]/div/div/div[3]/bla-actionbutton
    //#undefined
  })

  /**
   * This test adds a new "DSB-Kampfrichter"
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Neuer DSB-Kampfrichter', function() {
    cy.get('body').then((body) => {
      if (!body.text().includes('KampfrichterVorname')) {
        cy.get('[data-cy=dsb-mitglied-add-button]').click()
        cy.get('[data-cy=detail-vorname-feld]').type('KampfrichterVorname')
        cy.get('[data-cy=detail-nachname-feld]').type('KampfrichterNachname')
        cy.get('[data-cy=detail-geburtsdatum-feld]').type('2021-11-01')
        cy.get('[data-cy=detail-mitgliedsnummer-feld]').type('34563456')
        cy.get('[data-cy=detail-nationalitaet-feld]').select('Germany')
        cy.get('[data-cy=detail-vereine-dsb]').select('BSC Stuttgart')
        cy.wait(1500)
        /*
        @TODO implement Kampfrichterlizenz once function is available for testing
         */
        cy.get('[data-cy=detail-save-button]').click()
        cy.get('#OKBtn1').click()
        //cy.get('#undefinedActions > .action_icon > a > .ng-fa-icon > .fa-trash > path').last().click()
        //cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
      }}
    );
  })

  /**
   * This test deletes a single member and checks if after deletion the website redirects the user to the expected location
   */
  it('Löschen DSBMitglied', function() {
    cy.wait(1000)
    cy.contains('tr', 'SWTZweiTestLocal').find('[data-cy="TABLE.ACTIONS.DELETE"]').click();
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
    cy.url().should('include', '#/verwaltung/dsbmitglieder')
    //Überprüfung dass Elemente nicht in Liste
    //cy.should('not.contain.text', 'KampfrichterVorname')
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

  /**
   * This test adds a new user with two-factor-authentication
   */

  it('Testfall 12: User mit 2 Faktor Authentifizierung', function() {

    cy.get('[data-cy="dsb-mitglied-add-button"]').click();
    cy.get('select[data-cy="bla-selection-list"]').select('KampfrichterNachname,KampfrichterVorname No.:34563456');
    cy.get('[data-cy="username-input"]').type("DefaultCypressTestUser2WayAuth@cypressTestuser.com");
    cy.get('[data-cy="password-input"]').type('Test123456');
    cy.get('[data-cy="verify-password-input"]').type('Test123456');
    cy.get('#user2FA').click()
    cy.get('[data-cy="user-submit-button"]').click()

    cy.contains('.modal-content', 'Erfolg').within(() => {
      cy.get('.modal-dialog-ok button')
        .should('contain', 'OK')
        .click();
    });

    cy.wait(4000)
    cy.get('#qr > img').should('exist');
    cy.go('back')
    cy.deleteTestUser("DefaultCypressTestUser2WayAuth@cypressTestuser.com");

  })


  /**
   * This test adds a new user
   */

  it('Testfall 11: User hinzufügen', function() {
    cy.createUserTest("DefaultCypressTestUser@cypressTestuser.com");

    cy.contains('.modal-content', 'Erfolg').within(() => {
      cy.get('.modal-dialog-ok button')
        .should('contain', 'OK')
        .click();
    });

  })



  /**
   * This test edits a user
   */

  it('Testfall 9: User bearbeiten', function () {
    /*
    //cy.get('div > #management\.user\.table\.headers\.roleSorted > .ng-fa-icon > .svg-inline--fa > path').click()
    cy.get('[data-cy=TABLE.ACTIONS.EDIT]').last().click()
    cy.get('bla-double-selectionlist > bla-col-layout > .col-layout > bla-selectionlist > #left').select('0: 1')
    cy.get('bla-col-layout > .col-layout > bla-selectionlist > #left > option:nth-child(1)').click()
    cy.get('.col-layout > .shift-buttons > .shift-button > bla-button > #shiftLeft-left').click()
    cy.get('#userForm > .form-group > .col-sm-9 > bla-button > #userUpdateButton').click()
    cy.get('#OKBtn1').click()*/
    cy.assignRoleToTestUser("LIGALEITER", "DefaultCypressTestUser@cypressTestuser.com")
    cy.contains('.modal-content', 'Erfolg').within(() => {
      cy.get('.modal-dialog-ok button')
        .should('contain', 'OK')
        .click();
    });
  })


  /**
   * This test deletes a user
   */

    it('Testfall 10: User löschen', function() {
      /*
      cy.get('#sidebarCollapseBottom').click()
      cy.contains('VERWALTUNG').click()
      cy.get('#sidebarCollapseBottom').click()
      cy.url().should('include', '#/verwaltung')
      cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
      cy.url().should('include', '#/verwaltung/user')

      //löschen von Nicholas Corle - Moderator
      cy.get('#payload-id-4 > #undefinedActions > .action_icon > a > .ng-fa-icon > .fa-trash > path').click()
      cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
       */
      cy.deleteTestUser("DefaultCypressTestUser@cypressTestuser.com");

      //cy.get('[ng-reflect-color="action-btn-primary"] > #undefined > .action-btn-circle').click();
    })


  /**
   * This test shows the "Wettkampfklassen" tab in administration
   */
  it('Anzeige Wettkampfklassen', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-klassen-button]').click()
    cy.url().should('include', '#/verwaltung/klassen')
  })

  /**
   * This test edits a "Wettkampfklasse"
   */
  it('Wettkampfklasse bearbeiten', function () {
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
    cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1973')
    cy.get('[data-cy=wettkampfklassen-update-button]').click()
    cy.get('#OKBtn1').click()
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
    cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1972')
    cy.get('[data-cy=wettkampfklassen-update-button]').click()
    cy.get('#OKBtn1').click()
  })

  /**
   * This test adds a new "Wettkampfklasse"
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Wettkampfklasse hinzufügen', function () {
    cy.get('body').then((body) => {
      if (!body.text().includes('Testfall')) {
        cy.get('[data-cy=dsb-mitglied-add-button]').click()
        cy.get('[data-cy=wettkampfklasse-nummer]').type('69')
        cy.get('[data-cy=wettkampfklasse-name]').type('Testfall')
        cy.get('[data-cy=wettkampfklassen-jahrgang-von-button]').type('2000')
        cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1980')
        cy.get('[data-cy=wettkampfklassen-save-button]').click()
        cy.get('#OKBtn1').click()
      }
    });
  })

  /**
   * This test opens the administration table and check whether the table has any content
   */
  it('Anzeige Verwaltung Vereinsliste', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-vereine-button]').click()
    cy.url().should('include', '#/verwaltung/vereine')
    cy.wait(1000)
    cy.get('table').find('tr').its('length').should('be.greaterThan', 0)
  })

  /**
   * This test checks if it's possible to add a new club to the administration table successfully
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Neuen Verein anlegen', function () {
    cy.get('body').then((body) => {
      if (!body.text().includes('CypressTest')) {
        cy.get('[data-cy=dsb-mitglied-add-button]').click()
        cy.url().should('include', '#/verwaltung/vereine/add')
        cy.wait(1000)
        cy.get('[data-cy=vereine-vereinsname]').click().type('CypressTest')
        cy.wait(1000)
        cy.get('[data-cy=vereine-vereinsnummer]').click().type('1111111111')
        cy.wait(1000)
        cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest')
        cy.wait(1000)
        cy.get('[data-cy=vereine-add-button]').click()
        cy.get('#OKBtn1').click()
        cy.wait(1000)
        cy.get('[data-cy=sidebar-verwaltung-button]').click()
        cy.url().should('include', '#/verwaltung')
        cy.get('[data-cy=verwaltung-vereine-button]').click()
        cy.url().should('include', '#/verwaltung/vereine')
        cy.get('#undefined > tbody').should('contain.text', 'CypressTest')
        cy.wait(200)
        cy.get('#undefined > tbody').should('contain.text', '1111111111')
      }
    });
  })


  /**
   * This test checks if it's possible to edit a club (change the website...) successfully
   */
  it('Editieren eines Vereins', function () {

    cy.contains('td', '1111111111')
      .parent('tr')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]')
      .click();

    cy.wait(1000)
    cy.get('[data-cy=vereine-vereinswebsite]').focus().clear()
    cy.get('[data-cy=vereine-vereinswebsite]').click().type('cypresstest.com')
    cy.get('[data-cy=vereine-update-button]').click()
    cy.wait(500)
    cy.get('#OKBtn1').click()
    cy.contains('http://cypresstest.com')

    cy.contains('td', '1111111111')
      .parent('tr')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]')
      .click();

    cy.wait(1000)
    cy.get('[data-cy=vereine-vereinswebsite]').type('{selectall}{backspace}')
    cy.get('[data-cy=vereine-update-button]').click()
    cy.wait(200)
    cy.get('#OKBtn1').click()
    cy.wait(1500)
    cy.get('tr').last().find('td').eq(3).should('not.contain.value')
  })

  /**
   * This test checks if it is possible to add a new team to a club successfully
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Neue Vereins-Mannschaft anlegen', function () {
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.wait(1000)

    cy.get('body').then((body) => {
      if (!body.text().includes('69')) {
        cy.get('[data-cy=vereine-details-add-mannschaft-button]').click()
        cy.wait(1000)
        //cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsnummer]').click().type('69')
        cy.get('div > #mannschaftForm > .form-group > .col-sm-9 > #mannschaftNummer').type('69')
        cy.wait(15000)
        cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsveranstaltung]').select('Landesliga Süd')
        cy.wait(6000)
        //cy.get('[data-cy=vereine-mannschaft-detail-save-button]').click()
        cy.get('#mannschaftSaveButton').click()
        cy.wait(6000)
        cy.get('#OKBtn1').click()
        cy.wait(1000)
        cy.contains('69')
      }
    });
  })

  /**
   * The test checks if it's possible to edit a team successfully
   */
  it('Vereins-Mannschaft bearbeiten', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-vereine-button]').click()
    cy.url().should('include', '#/verwaltung/vereine')
    cy.wait(1000)
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.wait(500)
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.wait(9000)
    cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsnummer]').click().clear().type('76')
    cy.wait(9000)
    cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsveranstaltung]').select('Landesliga Süd')
    cy.wait(9000)
    cy.get('[data-cy=vereine-mannschaft-detail-update-button]').click()
    cy.wait(9000)
    cy.get('#OKBtn1').click()
    cy.wait(5000)
    cy.contains('76')
  })

  /**
   * The test checks if it's possible to delete a team successfully
   */
  it('Vereins-Mannschaft löschen', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-vereine-button]').click()
    cy.url().should('include', '#/verwaltung/vereine')
    cy.wait(1000)
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.wait(500)
    cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
    cy.wait(500)
    cy.get('button.action-btn-primary:contains("Ja")').click()
    cy.wait(500)
    cy.get('tbody').should('not.contain.text', '76')
  })

  /**
   * This test checks if it's possible to delete a club successfully
   */
  it('Einen Verein löschen', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-vereine-button]').click()
    cy.url().should('include', '#/verwaltung/vereine')
    cy.wait(1000)
    cy.get('tbody').should('contain.text', 'CypressTest')
    cy.wait(200)
    cy.get('tbody').should('contain.text', '1111111111')
    cy.contains('td', '1111111111')
      .parent('tr')
      .find('[data-cy="TABLE.ACTIONS.DELETE"]')
      .click();
    cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
    cy.get('tbody').should('not.contain.text', 'CypressTest')
    cy.wait(200)
    cy.get('tbody').should('not.contain.text', '1111111111')
    //cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  })

  /**
   * This test checks if the League-table is filled.
   */
  it('Alle Ligen zu sehen', function() {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-liga-button]').click()
    cy.wait(4000)
    cy.get('tbody').should('have.length.at.least', 1)
  })

  /**
   * This test adds a League and checks if it gets added.
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Liga Hinzufügen', function() {
    cy.get('body').then((body) => {
      if (!body.text().includes('SWT_Liga')) {
        cy.get('[data-cy=dsb-mitglied-add-button]').click()
        cy.wait(1000)
        cy.get('[data-cy=liga-detail-name]').type('SWT_Liga')
        cy.get('[data-cy=liga-detail-region]').select('SWT2_Region')
        cy.wait(10000)
        cy.get('[data-cy=liga-detail-uebergeordnet]').select('Bundesliga')
        cy.get('[data-cy=liga-detail-verantwortlicher]').select('admin@bogenliga.de')

        cy.typeInIFrame("Testliga");

        cy.wait(1000)
        cy.get('[data-cy=liga-save-button]').click()
        cy.wait(5000)
        cy.get('#OKBtn1').click()
        cy.wait(15000)
        cy.get('tbody').should('contain.text', 'SWT_Liga')
        cy.wait(5000)
      }
    });
  })

  /**
   * This test deletes a League and checks if its deleted in the table.
   */
  it('Liga Löschen', function() {
    cy.get('tbody').should('contain.text', 'SWT_Liga')
    cy.wait(5000)
    cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
    cy.wait(5000)
    cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
    cy.wait(10000)
    cy.get('tbody').should('not.contain.text', 'SWT_Liga')
  })

  /**
   *  This test checks if the Region-table is filled.
   */
  it('Regionen Anzeigen', function() {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-regionen-button]').click()
    cy.wait(4000)
    cy.get('tbody').should('have.length.at.least', 1)
  })


  /**
   * This test adds a Region and checks if it gets added.
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */
  it('Region Hinzufügen', function() {
    cy.get('body').then((body) => {
      if (!body.text().includes('SWT3_Region')) {
        cy.get('[data-cy=dsb-mitglied-add-button]').click()
        cy.get('[data-cy=region-detail-name]').type('SWT3_Region')
        cy.get('[data-cy=region-detail-kuerzel]').type('SWT_R')
        cy.get('[data-cy=region-detail-typ]').select('KREIS')
        cy.wait(2000)
        cy.get('[data-cy=region-detail-uebergeordnete-region]').select(0)
        cy.wait(2000)
        cy.get('[data-cy=region-save-button]').click()
        cy.get('#OKBtn1').click()
        cy.wait(1500)
        cy.get('tbody').should('contain.text', 'SWT3_Region')
      }
    });
  })

  /**
   * this test changes a Region and checks if the changes worked.
   */
  it('Region Ändern', function() {
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.wait(5000)
    cy.get('div > #regionenForm > .form-group > .col-sm-9 > #regionName').type('17')
    cy.get('[data-cy=region-detail-kuerzel]').type('1')
    cy.get('[data-cy=region-update-button]').click()
    cy.get('#OKBtn1').click()
    cy.wait(10000)
    cy.get('tbody').should('contain.text', 'SWT3_Region17')
  })

  /**
   * This test deletes a Region and checks if its deleted in the table.
   */
  it('Region Löschen', function() {
    cy.get('tbody').should('contain.text', 'SWT3_Region17')
    cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
    cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
    cy.wait(11000)
    cy.get('tbody').should('not.contain.text', 'SWT3_Region17')
  })

  /**
   * This test checks if the Event-table gets filled.
   */

  it('Veranstaltungen Anzeigen', function() {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
    cy.wait(5000)
    cy.get('[data-cy=bla-selection-list]').select('2018')
    cy.wait(5000)
    cy.get('tbody').should('have.length.at.least', 1)
  })

  /**
   * This test adds a "Veranstaltung" and checks if it gets added
   * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
   */

  it('Veranstaltungen hinzufügen', function() {
    cy.get('body').then((body) => {
      if (!body.text().includes('Testveranstaltung')) {
        cy.get('[data-cy=sidebar-verwaltung-button]').click()
        cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
        cy.wait(1000)
        cy.get('[data-cy=veranstaltung-add-button]').click()
        cy.get('[data-cy=veranstaltung-detail-name]').type('Testveranstaltung')
        cy.wait(10000)
        cy.get('[data-cy=veranstaltung-detail-liganame]').select('Bundesliga')
        cy.get('[data-cy=veranstaltung-detail-sportjahr]').type('2030')
        cy.get('[data-cy=veranstaltung-detail-deadline]').type('2030-01-01')
        cy.wait(1000)
        cy.get('[data-cy=veranstaltung-detail-save-button]').click()
        cy.wait(25000)
        cy.get('#OKBtn1').click()
        cy.get('[data-cy=sidebar-verwaltung-button]').click()
        cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
        cy.wait(5000)
        cy.get('[data-cy=bla-selection-list]').select('2030')
        cy.wait(1000)
        cy.get('tbody').should('contain.text', 'Testveranstaltung')
      }
    });
  })

  /**
   * This test edits a "Veranstaltung" and checks if it was changed
   */

  it('Veranstaltungen bearbeiten', function() {
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.get('[data-cy=veranstaltung-detail-name]').type('TTT')
    cy.wait(10000)
    cy.get('[data-cy=veranstaltung-detail-liganame]').select('Bundesliga')
    cy.wait(1000)
    cy.get('[data-cy=veranstaltung-detail-update-button]').click()
    cy.wait(1000)
    cy.get('#OKBtn1').click()
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
    cy.wait(5000)
    cy.get('[data-cy=bla-selection-list]').select('2030')
    cy.wait(1000)
    cy.get('tbody').should('contain.text', 'TestveranstaltungTTT')

  })

  /**
   * This test creates an Platzhalter for the Veranstaltung
   */

  it('Platzhalter erstellen', function() {
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
    cy.get('[data-cy=veranstaltung-detail-create-platzhalter]').click()
    cy.wait(3000)
    cy.get('#OKBtn1').click()
    cy.get('tbody').should('contain.text', 'Platzhalter')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
    cy.wait(5000)
    cy.get('[data-cy=bla-selection-list]').select('2030')
  })

  /**
   * This test deletes a "Veranstaltung" and checks if it was deleted in the table.
   */

  it('Veranstaltung Löschen', function() {
    cy.get('tbody').should('contain.text', 'TestveranstaltungTTT')
    cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
    cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
    cy.wait(1000)
    cy.get('tbody').should('not.contain.text', 'TestveranstaltungTTT')
  })

  /**
   * This test checks if "Wettkampftage" has entries.
   */

  it('Wettkampftage anzeigen', function() {
    cy.get('[data-cy=bla-selection-list]').select('2018')
    cy.wait(11000)
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
    cy.wait(5000)
    cy.get('[data-cy="wettkampftage-button"]').click()
    cy.wait(1000)
    cy.get('bla-col-layout > .col-layout > table > bla-selectionlist > #undefined').select(0)
  })

  /**
   * This test edits a "Wettkampftag" and checks if it was changed.
   */

   it('Wettkampftage bearbeiten', function() {
     cy.get('[data-cy="wettkampftage-adresse"]').clear().type('Bahnhofstrasse 221')
     cy.get('#wettkampftagePLZ').clear().type('70197')
     cy.get('#wettkampftageOrt').clear().type('Stuttgart')
     cy.get('[data-cy="wettkampftage-update-button"]').click()
     cy.wait(1000)
     cy.get('#OKBtn1').click()
     cy.wait(1000)
     cy.get('[data-cy="wettkampftage-zurueck"]').click()
     cy.get('[data-cy="wettkampftage-button"]').click()
     cy.wait(2000)
     cy.get('[data-cy="wettkampftage-adresse"]').should('have.value', 'Bahnhofstrasse 221')
     cy.get('[data-cy="wettkampftage-update-button"]').click()
     cy.wait(500)
     cy.get('#OKBtn1').click()
     cy.get('[data-cy="wettkampftage-zurueck"]').click()
     cy.get('[data-cy="wettkampftage-button"]').click()
     cy.wait(1000)
     cy.get('[data-cy="wettkampftage-adresse"]').type('{selectall}{backspace}')
     cy.get('[data-cy="wettkampftage-adresse"]').type('Bahnhofstrasse 22')
     cy.get('[data-cy="wettkampftage-update-button"]').click()
     cy.wait(500)
     cy.get('#OKBtn1').click()
     cy.get('[data-cy="wettkampftage-zurueck"]').click()
     cy.get('[data-cy="wettkampftage-button"]').click()
     cy.wait(2000)
     cy.get('[data-cy="wettkampftage-adresse"]').should('have.value', 'Bahnhofstrasse 22')
  })

})


/**
 * This test checks if the URL of Ligadetailseite is correct depending on the selected Liga ID
 */
describe('Ligadetailseite', function(){
  const randomID = generateLigaID().toString();

  it('Von Home ID gemerkt auf Ligatabelle ID', function() {
    cy.visit('http://localhost:4200/#/home/' + randomID)
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle/' + randomID)
  })

  it('Von Ligatabelle ID gemerkt auf Home ID', function() {
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.get('[data-cy=sidebar-home-button]').click()
    cy.url().should('include', '#/home/' + randomID)
  })

  it('"Wettbewerbe anzeigen" Button', function() {
    cy.get('[id*=ligadetailRegionSaveButton]').click()
    cy.url().should('include', '#/wettkaempfe/' + randomID)
  })

  it('Deselektieren der LigaID', function() {
    cy.get('[id*=navbar-header]').click()
    cy.url().should('not.include', '#/home/' + randomID)
  })
}
)

describe('Ligaleiter User Tests', function(){
    const randomID = generateLigaID().toString();

    // nach Test ist Ligaleiter angemeldet
    it('Ligadetail bearbeiten für zuständige Liga', function() {

      cy.visit('http://localhost:4200/#/verwaltung/liga')

      cy.wait(10000)

      //Überprüfen, ob eine Liga existiert die der Ligaleiter bearbeiten kann
      cy.get('body').then($body => {
        if($body.text().includes('TeamLigaleiter@bogenliga.de')) {
          // Liga existiert
          cy.log('existiert')
        } else {
          // keine Liga existiert für die Ligaleiter zuständig ist
          // hier wird eine solche Liga erstellt

          cy.log('existiert nicht')
          cy.visit('http://localho  st:4200/#/verwaltung/liga/add')

          cy.wait(10000)

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').click()

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').type('Ligaleiter Test Liga')

          cy.get('[data-cy=liga-detail-verantwortlicher]').select("TeamLigaleiter@bogenliga.de");

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaVerantwortlicher').select('2: Object')


          cy.get('.form-group > .col-sm-9 > bla-actionbutton > #ligaSaveButton > .action-btn-circle').click()

          // TinyMCE Text eingeben
          cy.get('iframe#ligaDetail_ifr')
            .then(($iframe) => {
              const body = $iframe.contents().find('body');

              cy.wrap(body).clear().type('Hier ist ein Text, der eingegeben wird');
            });

          // Save Button nach Eingabe von TinyMCE Text
          cy.get('#ligaSaveButton').click();

          // nach klick auf Speichern warten
          cy.wait(6000)

          //auf ok klicken
          cy.get('#OKBtn1 > .action-btn-circle').click();
        }
      })


      // auf Profil klicken
      cy.get('.fa-user-circle').click();
      // auf ausloggen klicken
      cy.contains('Logout').click();
      cy.wait(2000);

      // ab hier Ligaleiter

      cy.visit('http://localhost:4200/#/user/login')
      cy.wait(2000);

      cy.contains('Login für Team Ligaleiter').click();
      cy.wait(2000);

      cy.visit('http://localhost:4200/#/verwaltung/liga')
      cy.wait(12000)

      // auf Liga bearbeiten klicken
      cy.get('.action_icon > a > .ng-fa-icon > .fa-edit > path').click()
      cy.wait(2000)

      // random Text generieren
      const text = Math.random().toString(36).substring(2,7);
      // in TinyMCE Text eingeben
      cy.get('iframe#ligaDetail_ifr')
        .then(($iframe) => {
          const body = $iframe.contents().find('body');

          cy.wrap(body).clear().type(text);
        });

      // klick auf Update
      cy.get('#ligaForm > .form-group > .col-sm-9 > bla-actionbutton > #ligaUpdateButton').click()
      cy.wait(5000)

      // klick auf OK
      cy.get('.modal-dialog > .modal-content > .modal-footer > #OKBtn1 > #OKBtn1').click()

      cy.wait(12000)

      // auf Liga bearbeiten klicken
      cy.get('.action_icon > a > .ng-fa-icon > .fa-edit > path').click()

      cy.wait(500)

      let link;

      cy.wait(2000)


      cy.wait(200)

      let textReadFromEditor

      // Text von Editor einlesen und mit random-Text vergleichen
      cy.window()
        .then(win => {
          textReadFromEditor = win.tinymce.activeEditor.getContent({format: 'text'});
        }).then(() => {
          expect(textReadFromEditor).to.equal(text)})

    })

  }
)


