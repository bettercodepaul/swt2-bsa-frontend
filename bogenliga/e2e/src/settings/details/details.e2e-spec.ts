import {SettingsDetails} from './details.po';
import {SettingsOverview} from '../overview/overview.po';

// Propaply doesnt work because of right management

describe('Settings Details', () => {
  let details: SettingsDetails;
  let overview: SettingsOverview;

  beforeEach(() => {
    details = new SettingsDetails();
    overview = new SettingsOverview();
    details.navigateToSettingsDetails();
  });

  it('should exist', () => {
    expect(details.getSettingsDetails()).toBeTruthy();
  });

  xit('should display Settings Detials header', () => {
    expect(details.getHeading()).toBeTruthy();
  });

  xit('should display Settings Detials key if data selected', () => {
    // navigate to Details with selecting data
    overview.navigateToSettingsOverview();
    overview.getFirstDetailsButton().click();
    expect(details.isKeyPresent).toBeTruthy();
  });

  xit('should not display Settings Detials key if no data selected', () => {
    // navigate to Details without selecting data
    overview.navigateToSettingsOverview();
    overview.getAddButton().click();
    expect(details.isKeyPresent()).toBeFalsy();
  });

  xit('should display Settings Detials version if data selected', () => {
    // navigate to Details with selecting data
    overview.navigateToSettingsOverview();
    overview.getFirstDetailsButton().click();
    expect(details.isVersionPresent()).toBeTruthy();
  });

  xit('should not display Settings Detials version if no data selected', () => {
    // navigate to Details without selecting data
    overview.navigateToSettingsOverview();
    overview.getAddButton().click();
    expect(details.isVersionPresent()).toBeFalsy();
  });

  xit('should have label for Key Input', () => {

  });

  xit('should have label for Value Input', () => {

  });

  xit('should have non edible Key Input', () => {

  });

  xit('should have Value Input', () => {

  });

  xit('should have Back Button', () => {

  });

  xit('should have Delete Button only when data is selected', () => {

  });

  xit('should have Save Button', () => {

  });
});
