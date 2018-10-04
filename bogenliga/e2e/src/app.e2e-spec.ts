import {HomePage} from './home.po';
import {Support} from './support.po';
import {Footer} from './footer.po';
import {Navbar} from './navbar.po';
import {browser, by} from 'protractor';
import {Sidebar} from './sidebar.po';
import {stringify} from 'querystring';
import {SettingsOverview} from './settings_overview.po';
import {Wettkampf} from '../../src/app/modules/wettkampf/types/wettkampf';
import {Wettkaempfe} from './wettkaempfe.po';

describe('Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateToHome();
  });

  it('should exist', () => {
    expect(page.getHome()).toBeTruthy();
  });

  it('should be first page to be seen', () => {
    browser.get('/');
    expect(page.getHomeHeading()).toEqual('Herzlich Willkommen');
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

  it('table should have a table', () => {
    expect(page.getTable()).toBeTruthy();
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
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let sidebar: Sidebar;

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

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(support.isSupportPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // Sportjahresplan

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(support.isSupportPresent()).toBeTruthy();

    // Settings Details

  });
});

describe('Footer', () => {
  let footer: Footer;
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let sidebar: Sidebar;

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

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(footer.isFooterPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // Sportjahresplan

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(footer.isFooterPresent()).toBeTruthy();

    // Settings Details

  });
});

describe('Navbar', () => {
  let navbar: Navbar;
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let sidebar: Sidebar;

  beforeEach(() => {
    navbar = new Navbar();
    navbar.navigateToHome();
  });

  it('should exist', () => {
    expect(navbar.getNavbar()).toBeTruthy();
  });

  it('Toggle should exist', () => {
    expect(navbar.getToggle).toBeTruthy();
  });

  it('Logo should exist', () => {
    expect(navbar.getLogo()).toBeTruthy();
  });

  it('Title should exist', () => {
    expect(navbar.getTitel()).toBeTruthy();
  });

  it('should have translate de', () => {
    expect(navbar.getDe()).toEqual('de');
  });

  it('should have translate en', () => {
    expect(navbar.getEn()).toEqual('en');
  });

  it('Settings should exist', () => {
    expect(navbar.getSettings).toBeTruthy();
  });

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(navbar.isNavbarPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // Sportjahresplan

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(navbar.isNavbarPresent()).toBeTruthy();
    // Settings Details

  });
});

describe('Sidebar', () => {
  let sidebar: Sidebar;
  let home: HomePage;
  let settingsOverview: SettingsOverview;

  beforeEach(() => {
    sidebar = new Sidebar();
    sidebar.navigateToHome();
  });

  it('should exist', () => {
    expect(sidebar.getSidebar()).toBeTruthy();
  });

  it('Heading should be "BL" before button click', () => {
    expect(sidebar.isShortTitlePresent()).toBeTruthy();
    expect(sidebar.isTitlePresent()).toBeFalsy();
  });

  it('should have no text before button click', () => {
    expect(sidebar.isTextPresent()).toBeFalsy();
  });

  it('Heading should be "Bogenliga" after button click', () => {
    sidebar.clickButton();
    expect(sidebar.isTitlePresent()).toBeTruthy();
    expect(sidebar.isShortTitlePresent()).toBeFalsy();
  });

  it('should have text after button click', () => {
    sidebar.clickButton();
    expect(sidebar.getSidebarText()).toBeTruthy();
    expect(sidebar.getTextHome()).toEqual('HOME');
    expect(sidebar.getTextVerwaltung()).toEqual('VERWALTUNG');
    expect(sidebar.getTextWettkaempfe()).toEqual('WETTKAEMPFE');
    expect(sidebar.getTextSportjahresplan()).toEqual('SPORTJAHRESPLAN');
  });

  it('should have icons before and after click', () => {
    expect(sidebar.getIcons()).toBeTruthy();
    expect(sidebar.getIconHome()).toBeTruthy();
    expect(sidebar.getIconSportjahresplan()).toBeTruthy();
    expect(sidebar.getIconVerwaltung()).toBeTruthy();
    expect(sidebar.getIconWettkaempfe()).toBeTruthy();
    sidebar.clickButton();
    expect(sidebar.getIcons()).toBeTruthy();
    expect(sidebar.getIconHome()).toBeTruthy();
    expect(sidebar.getIconSportjahresplan()).toBeTruthy();
    expect(sidebar.getIconVerwaltung()).toBeTruthy();
    expect(sidebar.getIconWettkaempfe()).toBeTruthy();
  });

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(sidebar.isSidebarPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // Sportjahresplan

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(sidebar.isSidebarPresent()).toBeTruthy();
    // Settings Details

  });
});

describe('Settings Overview', () => {
  let overview: SettingsOverview;

  beforeEach(() => {
    overview = new SettingsOverview();
    overview.navigateToSettingsOverview();
  });

  it('should exist', () => {
    expect(overview.getSettingsOverview()).toBeTruthy();
  });

  it('should display header', () => {
    expect(overview.getHeading()).toBeTruthy();
  });

  it('should have an add button', () => {
    expect(overview.getAddButton()).toBeTruthy();
  });

  // link to details from button

  it('table should have a table', () => {
    expect(overview.getTable()).toBeTruthy();
  });

  it('table should have a table header', () => {
    expect(overview.getTableHeader()).toBeTruthy();
  });

  it('table should have at least one row', () => {
    expect(overview.getFirstRowData()).toBeTruthy();
  });
});

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
