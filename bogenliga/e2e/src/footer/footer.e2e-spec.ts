import {Footer} from './footer.po';
import {HomePage} from '../home/home.po';

import {SettingsDetails} from '../settings/details/details.po';
import {SettingsOverview} from '../settings/overview/overview.po';

describe('Footer', () => {
  let footer: Footer;
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let settingsDetails: SettingsDetails;

  beforeEach(() => {
    footer = new Footer();
    footer.navigateToHome();
  });

  it('should exist', () => {
    expect(footer.getFooter()).toBeTruthy();
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

    // wkdurchfuehrung

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(footer.isFooterPresent()).toBeTruthy();
    // Settings Details
    settingsDetails = new SettingsDetails();
    settingsDetails.navigateToSettingsDetails();
    expect(footer.isFooterPresent()).toBeTruthy();
  });
});
