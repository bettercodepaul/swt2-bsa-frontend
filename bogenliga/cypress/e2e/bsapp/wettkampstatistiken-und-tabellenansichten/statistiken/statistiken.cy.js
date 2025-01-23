/*
  Test mit angewandten Best Practices.
  Wenn in der Datenbank die Infos zu den neuen Statistiken angepasst werden,
  auskommentierte Zeilen wieder entkommentieren
  (Nur Annahme, dass Fehler in der DB liegt)
   */
describe('Statistics dropdown menu', function () {
  const baseUrl = 'http://localhost:4200/#/wettkaempfe';
  const statisticsOptions = [
    { value: 'einzelstatistik', label: 'Einzelstatistik' },
    { value: 'schuetzenstatistikMatch', label: 'Schützenstatistik Match' },
    { value: 'gesamtstatistik', label: 'Gesamtstatistik' },
    //{ value: 'wettkampftagestatistik', label: 'Wettkampftagestatistik' },
    //{ value: 'wettkampfstatistik', label: 'Wettkampfstatistik' },
    //{ value: 'schnittStatistik', label: 'Schnitte über die letzten Jahre' },
  ];

  beforeEach(() => {
    cy.viewport(2558, 1103);
    cy.visit(baseUrl);
  });

  function selectAndVerifyStatistic(option) {
    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken')
      .select(option.value, { force: true })
      .should('have.value', option.value);
  }

  it('Select all statistics options', function () {
    statisticsOptions.forEach((option) => {
      selectAndVerifyStatistic(option);
    });
  });
});

/*
  Alter Test, aber hier erkannt man am besten wo das Problem liegt.
 */

describe('Statistics dropdown menu', function() {

  it('Select all Statistiken test', function() {
    cy.viewport(2558, 1103)

    cy.visit('http://localhost:4200/#/wettkaempfe')

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('schuetzenstatistikMatch', {force: true})

    cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('gesamtstatistik', {force: true})

    })

})


