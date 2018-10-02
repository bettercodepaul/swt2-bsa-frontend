import {HomePage} from './home.po';
import {Support} from './support.po';
import {Footer} from './footer.po';

describe('Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateToHome();
  });

  it('should exist', () => {
    expect(page.getHome()).toBeTruthy();
  });

  it('should display welcome message', () => {
    expect(page.getHomeHeading()).toBeTruthy();
  });

  it('should display welcome text', () => {
    expect(page.getHomeParagraph()).toBeTruthy();
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

describe('Support', () => {
  let support: Support;

  beforeEach(() => {
    support = new Support();
    support.navigateToHome();
  });

  it('should exist', () => {
    expect(support.getSupport()).toBeTruthy();
  });

  it('should display Support', () => {
    expect(support.getParagraph()).toBeTruthy();
  });

  it('should display Logos', () => {
    expect(support.getLogos()).toBeTruthy();
  });
});

describe('Footer', () => {
  let footer: Footer;

  beforeEach(() => {
    footer = new Footer();
    footer.navigateToHome();
  });

  it('should exist', () => {
    expect(footer.getFooter()).toBeTruthy();
  });

  it('should link to Kontakt', () => {
    expect(footer.getKontakt()).toEqual('Kontakt');
  });

  it('should link to Impressum und Datenschutz', () => {
    expect(footer.getImpressumUndDatenschutz()).toEqual('Impressum und Datenschutz');
  });

});
