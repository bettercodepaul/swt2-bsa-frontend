import {SettingsOverview} from './overview.po';

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
