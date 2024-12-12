describe('Statistics dropdown menu', function() {

  it('Select all Statistiken test', function() {
    cy.viewport(2558, 1103)

    cy.visit('http://localhost:4200/#/wettkaempfe')

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('schuetzenstatistikMatch', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('gesamtstatistik', {force: true})


    })

})
