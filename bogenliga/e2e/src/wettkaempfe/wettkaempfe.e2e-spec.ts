import {Wettkaempfe} from './wettkaempfe.po';

// Propaply doesnt work because of right management

describe('Wettkaempfe', () => {
  let wettkaempfe: Wettkaempfe;

  beforeEach(() => {
    wettkaempfe = new Wettkaempfe();
    wettkaempfe.navigateToWettkaempfe();
  });

  xit('should exist', () => {
    expect(wettkaempfe.getWettkaempfe()).toBeTruthy();
  });

  xit('should display Wettkaempfe header', () => {
    expect(wettkaempfe.getHeading()).toBeTruthy();
  });

  xit('table should have a Wettkaempfe table', () => {
    expect(wettkaempfe.getWettkampfeTable()).toBeTruthy();
  });

  xit('table should have a Wettkaempfe table header', () => {
    expect(wettkaempfe.getWettkampfeTableHeader()).toBeTruthy();
  });

  xit('table should have at least one row in Wettkaempfe table', () => {
    expect(wettkaempfe.getWettkampfeFirstRowData()).toBeTruthy();
  });

  xit('should display Legende header', () => {
    expect(wettkaempfe.getTitleLegende()).toBeTruthy();
  });

  xit('table should have a Legende table', () => {
    expect(wettkaempfe.getLegendsTable()).toBeTruthy();
  });

  xit('table should have a Legende table header', () => {
    expect(wettkaempfe.getLegendsTableHeader()).toBeTruthy();
  });

  xit('table should have at least one row in Legende table', () => {
    expect(wettkaempfe.getLegendsFirstRowData()).toBeTruthy();
  });
});
