describe('WKDURCHFUEHRUNG - Button Existenztest', () => {
  it('prüft, ob der setupTabletSchusszettel Button sichtbar ist', () => {
    cy.visit('http://localhost:4200/#/wkdurchfuehrung');
    cy.contains('Druckdaten').click({force:true});
    cy.get('#setupTabletSchusszettel').should('be.visible');

  });
});
