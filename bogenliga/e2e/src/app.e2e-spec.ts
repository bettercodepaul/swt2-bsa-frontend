import {HomePage} from './home.po';
import {Footer} from './footer.po';

describe('Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateToHome();
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

describe('Footer', () => {
  let footer: Footer;

  beforeEach(() => {
    footer = new Footer();
    footer.navigateToHome();
  });

  it('should have flexChildren', () => {
    expect(footer.getFlexContainer).toBeTruthy();
  });

  it('should display Heading', () => {
    expect(footer.getHeading()).toBeTruthy();
  });

  it('should display Paragraph', () => {
    expect(footer.getParagraph()).toBeTruthy();
  });

  it('should display Impressum', () => {
    expect(footer.getImpressum()).toEqual('Impressum');
  });

  it('should display Kontakt', () => {
    expect(footer.getKontakt()).toEqual('Kontakt');
  });

  it('should have an Image', () => {
    expect(footer.getImage).toBeTruthy();
  });
});
