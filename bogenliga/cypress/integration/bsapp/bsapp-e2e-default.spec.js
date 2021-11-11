describe('Anonyme User tests', function () {
  it('Testfall 1: Home aufrufen / Wettkampftabelle gefüllt', function () {
    cy.visit('http://localhost:4200/')
    cy.url().should('include', '#/home')
  })

  it('Testfall 2: Login möglich / Fenster öffnet sich', function() {
    cy.visit('http://localhost:4200/')
    cy.get('bla-navbar > #navbar > #navbar-right > .nav-link > .btn').click()
    cy.url().should('include', '#/user/login')
  })

  it('Testfall 3: Anzeige Regionen', function() {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('REGIONEN').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/regionen')
  })

  it('Testfall 4: Sunburst details anzeigen', function () {
    cy.get(':nth-child(2) > .main-arc').click()
    cy.wait(1000)
    cy.get('#details')
  })

  it('Testfall 5: Weiterleitung Ligatabelle', function () {
    cy.get('#ligen > bla-selectionlist > #undefined').select(0)
    cy.wait(2000)
    cy.url().should('include', '#/ligatabelle')
  })

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

  it('Testfall 7: Anzeige Vereine', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('VEREINE').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/vereine')
  })

  it('Testfall 8: Vereinsliste Verringert sich', function() {
    cy.visit('http://localhost:4200/#/home')
    cy.get('.navbar-text > bla-sidebar-item > .sidebar-link > .ng-fa-icon > .fa-users').click()
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').click()
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').type('SV')
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list').should('have.length.at.least', 1)
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list > .input-group > #undefined').type('X')
    cy.get('.col-layout > bla-quicksearch-list > .quicksearch-list').should('have.length', 1)
  })

  it('Testfall 9: Anzeige Ligatabelle', function () {
    cy.get('#sidebarCollapseBottom').click()
    cy.contains('LIGATABELLE').click()
    cy.get('#sidebarCollapseBottom').click()
    cy.url().should('include', '#/ligatabelle')
  })

  it('Testfall 10: Suchfeld Ligatabelle', function() {
    cy.get('.input-group > #undefined').type('SWT2')
    cy.wait(1000)
    cy.get('bla-selectionlist').should('contain.text', 'SWT2_Liga')
    cy.contains('SWT2_Liga').click()
  })

})
