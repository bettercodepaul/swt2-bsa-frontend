import {HomePage} from './home.po';

describe('Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateToHome();
  });

  it('should display welcome message', () => {
    expect(page.getHomeHeading()).toEqual('Herzlich Willkommen');
  });

  it('should display welcome text', () => {
    expect(page.getHomeParagraph()).toEqual('Auf der Seite von Bogenliga DE, hier finden Sie alle Informationen der Deutschen Ligen im Bogenschießen.' +
      ' Stöbern Sie durch die Ligen und lassen Sie sich in die Faszination des Mannschafts Bogensport ziehen.');
  });

  it('should have flexChildren', () => {
    expect(page.getFlexChildren).toBeTruthy();
  });

  it('table should have a table header', () => {
    expect(page.getTableHeader()).toContain('Datum Uhrzeit Liga Ort');
  });

  it('table should have at least one row', () => {
    expect(page.getFirstRowData()).toBeTruthy();
  });
});
