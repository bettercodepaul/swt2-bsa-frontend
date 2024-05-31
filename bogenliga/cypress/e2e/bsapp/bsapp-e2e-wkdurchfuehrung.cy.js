describe('Wkdurchfuehrung tests', function () {
  beforeEach(() => {
    cy.loginAdmin()
    cy.wait(1000)
  })

  /**
   * This tests the fullscreen button for the presenter view
   */
  it('Aktivierung der Vollbildansicht nach Auswahl', () => {
    const veranstaltung = '1'; // hard coded to the event, the test uses
    const wettkampftag = '1.%20Wettkampftag'; // hard coded to the day, the test uses

    cy.visit(`/#/wkdurchfuehrung?wettkampftag=${wettkampftag}&veranstaltung=${veranstaltung}`);

    let openedUrl;
    cy.window().then(win => {
      cy.stub(win, 'open').callsFake(url => {
        openedUrl = url;
        return win;
      }).as('open');
    });

    cy.expandWettkampfTage();
    cy.get('#payload-id-30 > #undefinedActions > .action_icon > [data-cy="TABLE.ACTIONS.VIEW"] > [data-cy="actionButton"]').click();
    cy.wait(1000);

    cy.get('[ng-reflect-header-text="Druckdaten"]').then($header => {
      $header.click();
    });

    cy.get('[data-cy=vollbildAnsichtButton]').click();
    cy.get('@open').should('be.called');

    cy.wrap(null).then(() => {
      expect(openedUrl).to.exist;
      cy.visit(`${openedUrl}/fullscreen`);
    });

    cy.url().should('include', '/fullscreen');

    //Additional testing for when the table works

    cy.go('back');
  });


  /**
   * This test opens the sidebar and clicks on the "WKDURCHFUEHRUNG" tab and checks if the url has changed successfully
   */
  it('Anzeige Wkdurchfuehrung',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/wkdurchfuehrung')
  })

  /**
   * This test checks if Veranstaltungen in wkdurchfuehrung load correctly
   */
  it('Anzeige Veranstaltung und Jahre in Wkdurchfuehrung',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.wait(1000)
    cy.get('[ng-reflect-header-text="Veranstaltungen"] > .expand-container > .expand-header').click()
    cy.wait(1000)
    cy.get('[ng-reflect-header-text="Veranstaltungen"] > .expand-container > .expand-header > .expand-icon').click()
    cy.wait(1000)
    cy.get('[data-cy="bla-selection-list"]').should('be.visible')
  })

  /**
   * This test checks if Matches of Wettkampftage in wkdurchfuehrung load correctly
   */
  it('Anzeige Wettkampftage in Wkdurchfuehrung',  () => {
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.wait(1000)
    cy.get('[data-cy="bla-selection-list"]').select(1)
    cy.wait(1000)
    cy.get('[data-cy="wkdurchfuehrung-wettkampftage-list"] > .table-responsive').should('be.visible')
  })

  /**
   * This test checks if buttons of Wettkampftage-table are displayed
   */
  it('Anzeige Action-Buttons', () => {
    cy.expandWettkampfTage()
    cy.get('#payload-id-30 > #undefinedActions > .action_icon > [data-cy="TABLE.ACTIONS.VIEW"] > ' +
      '[data-cy="actionButton"]').should('be.visible')
  })

  /**
   * This test checks if click on buttons collapses Wettkampftage-Tabelle
   */
  it('Einklappen Tabelle auf Button-Click', () => {
    cy.expandWettkampfTage()
    cy.get('#payload-id-30 > #undefinedActions > .action_icon > [data-cy="TABLE.ACTIONS.VIEW"] > ' +
      '[data-cy="actionButton"]').click()
    cy.wait(1000)
    cy.get('.expandContainer > .expand-container > .expand-content').should('not.be.visible')
  })

  /**
   * This test checks if click on buttons displays Druckdaten
   */
  it('Anzeigen Druckdaten auf Button-Click', () => {
    cy.expandWettkampfTage()
    cy.get('#payload-id-30 > #undefinedActions > .action_icon > [data-cy="TABLE.ACTIONS.VIEW"] > ' +
      '[data-cy="actionButton"]').click()
    cy.wait(1000)
    cy.get('[ng-reflect-header-text="Druckdaten"] > .expand-container > .expand-content').should('be.visible')
  })





})

/**
 * Tests for offline functionality
 */
describe("offline-fähigkeit", {browser: "!firefox"}, () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  /**
   * This test checks if going offline works
   */
  it('Offline gehen in wkdurchfuehrung',  () => {

    cy.url().should('include', '#/user/login')
    cy.get('[data-cy=login-als-admin-button]').click()
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.url().should('include', '#/wkdurchfuehrung')

    cy.wait(2000)
    cy.get('[data-cy="wkdurchfuehrung-btn-offlinegehen"]').click()

    cy.wait(3000) //  offile feahigkeit does not work
    cy.get('.modal-dialog-header').should('be.visible').should('contain.text', ' Offline-Modus aktiviert')
    cy.get('.modal-dialog-ok').find('bla-button').click()
    cy.get('.modal-content').should('not.be.visible')
  })

  it('Offline wkdurchfuehrung Daten anzeigen', () => {
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.url().should('include', '#/wkdurchfuehrung')
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Veranstaltung Tabelle anzeigen', () =>{
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Wettkampftage Tabelle anzeigen', () =>{
    cy.get('[data-cy=wkdurchfuehrung-wettkampftage-list]')
      .find('[data-cy="TABLE.ACTIONS.VIEW"]').should('be.visible')
  })

  it('Offline Match Tabelle anzeigen', () => {
    cy.get('[data-cy="wkdurchfuehrung-match-list"]')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]').should('be.visible')
  })

  it('Zu Offline Match Seite wechseln', () =>{
    cy.get('[data-cy="wkdurchfuehrung-match-list"]')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
    cy.url().should('include', '#/wkdurchfuehrung/schusszettel')
  })

  let originalMatchID
  it('Nächstes Match anzeigen', () =>{
    cy.url().then(url=>{
      let oldUrl = url.toString().split('/')

      originalMatchID = oldUrl[oldUrl.length-1]
      cy.get('.nextButton:nth-child(2)').click();
      cy.url().should('not.include', originalMatchID)
    })
  })

  it('Vorheriges Match anzeigen', () =>{
    cy.get('.nextButton:nth-child(1)').click();
    cy.url().should('include', originalMatchID)
  })

})
