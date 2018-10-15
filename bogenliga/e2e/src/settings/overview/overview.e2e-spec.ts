import {SettingsOverview} from './overview.po';

// Propaply doesnt work because of right management

describe('Settings Overview', () => {
  let overview: SettingsOverview;

  beforeEach(() => {
    overview = new SettingsOverview();
    overview.navigateToSettingsOverview();
  });

  xit('should exist', () => {
    expect(overview.getSettingsOverview()).toBeTruthy();
  });

  xit('should display header', () => {
    expect(overview.getHeading()).toBeTruthy();
  });

  xit('should have an add button', () => {
    expect(overview.getAddButton()).toBeTruthy();
  });

  // link to details from button

  xit('table should have a table', () => {
    expect(overview.getTable()).toBeTruthy();
  });

  xit('table should have a table header', () => {
    expect(overview.getTableHeader()).toBeTruthy();
  });

  xit('table should have at least one row', () => {
    expect(overview.getFirstRowData()).toBeTruthy();
  });
});
