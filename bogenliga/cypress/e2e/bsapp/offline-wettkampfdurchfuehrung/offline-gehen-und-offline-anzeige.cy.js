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
    cy.visit(`/#/wkdurchfuehrung/`);
    cy.url().should('include', '#/wkdurchfuehrung/')

    cy.expandWettkampfTage()
    cy.wait(2000)
    cy.get('[data-cy="wkdurchfuehrung-btn-offlinegehen"]').click()

    cy.wait(3000) //  offile feahigkeit does not work
    cy.get('.modal-dialog-header').should('be.visible').should('contain.text', ' Offline-Modus aktiviert')
    cy.get('.modal-dialog-ok').find('bla-button').click()
    cy.get('.modal-content').should('not.be.visible')
  })

  it('Offline wkdurchfuehrung Daten anzeigen', () => {
    cy.expandWettkampfTage()
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.url().should('include', '#/wkdurchfuehrung')
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Veranstaltung Tabelle anzeigen', () =>{
    cy.expandWettkampfTage()
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Wettkampftage Tabelle anzeigen', () =>{
    cy.expandWettkampfTage()
    cy.get('[data-cy=wkdurchfuehrung-wettkampftage-list]')
      .find('[data-cy="TABLE.ACTIONS.VIEW"]').should('be.visible')
  })

  it('Offline Match Tabelle anzeigen', () => {
    cy.get('[data-cy="wkdurchfuehrung-match-list"]')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]').should('be.visible')
  })

  it('Zu Offline Match Seite wechseln', () =>{
    cy.expandWettkampfTage()
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
