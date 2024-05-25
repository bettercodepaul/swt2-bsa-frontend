describe('Statistics dropdown menu', function() {

 /* it('Show statistics button', function() {
    cy.viewport(1440, 739)
    cy.visit('http://localhost:4200/#/wettkaempfe')

    cy.dismissModal()
    cy.get('#showResultsButton').invoke('removeAttr', 'disabled').click()

    cy.get('div > #regionenForm > #Button > bla-actionbutton:nth-child(3) > #showResultsButton').click()
  })

  it('Dropdown option statistics per archer', function() {
    cy.dismissModal()
    cy.get('#statistiken').invoke('removeAttr', 'disabled')

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik')
  })

  it('Dropdown option complete statistics', function() {
    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('gesamtstatistik')
  })
*/
  it('Select all Statistiken test', function() {
    cy.viewport(2558, 1103)

    cy.visit('http://localhost:4200/#/wettkaempfe')

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('schuetzenstatistikMatch', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('gesamtstatistik', {force: true})


  })

})
