import {Wettkaempfe} from './wettkaempfe.po';

describe('Wettkaempfe', () => {
  let wettkaempfe: Wettkaempfe;

  beforeEach(() => {
    wettkaempfe = new Wettkaempfe();
    wettkaempfe.navigateToWettkaempfe();
  });

  it('should exist', () => {
    expect(wettkaempfe.getWettkaempfe()).toBeTruthy();
  });

  it('should display Wettkaempfe header', () => {
    expect(wettkaempfe.getHeading()).toBeTruthy();
  });

  it('table should have a Wettkaempfe table', () => {
    expect(wettkaempfe.getWettkampfeTable()).toBeTruthy();
  });

  it('table should have a Wettkaempfe table header', () => {
    expect(wettkaempfe.getWettkampfeTableHeader()).toBeTruthy();
  });

  it('table should have at least one row in Wettkaempfe table', () => {
    expect(wettkaempfe.getWettkampfeFirstRowData()).toBeTruthy();
  });

  it('should display Legende header', () => {
    expect(wettkaempfe.getTitleLegende()).toBeTruthy();
  });

  it('table should have a Legende table', () => {
    expect(wettkaempfe.getLegendsTable()).toBeTruthy();
  });

  it('table should have a Legende table header', () => {
    expect(wettkaempfe.getLegendsTableHeader()).toBeTruthy();
  });

  it('table should have at least one row in Legende table', () => {
    expect(wettkaempfe.getLegendsFirstRowData()).toBeTruthy();
  });
});
