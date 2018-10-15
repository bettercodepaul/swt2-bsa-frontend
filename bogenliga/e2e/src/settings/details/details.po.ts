import { browser, by, element } from 'protractor';
// Propaply doesnt work because of right management
export class SettingsDetails {
  navigateToSettingsDetails() {
    return browser.get('/settings/details');
  }

  getSettingsDetails() {
    return element(by.css('#settingsDetails'));
  }

  getHeading() {
    return this.getSettingsDetails().element(by.css('#heading')).getText();
  }

  getKey() {
    return this.getSettingsDetails().element(by.css('#headingKey'));
  }

  isKeyPresent() {
    return browser.isElementPresent(this.getKey());
  }

  getVersion() {
    return this.getSettingsDetails().element(by.css('#headingVersion'));
  }

  isVersionPresent() {
    return browser.isElementPresent(this.getVersion());
  }

  getButtonBackData() {
    return this.getSettingsDetails().element(by.css('#backData')).getText();
  }

  getButtonBackNoData() {
    return this.getSettingsDetails().element(by.css('#backNoData')).getText();
  }

  getButtonDelete() {
    return this.getSettingsDetails().element(by.css('#deleteData')).getText();
  }

  getButtonSaveData() {
    return this.getSettingsDetails().element(by.css('#saveData')).getText();
  }

  getButtonSaveNoData() {
    return this.getSettingsDetails().element(by.css('#saveNoData')).getText();
  }

  getLabelKeyData() {
    return this.getSettingsDetails().element(by.css('#labelKeyData'));
  }

  getLabelKeyNoData() {
    return this.getSettingsDetails().element(by.css('#labelKeyNoData'));
  }

  getLabelValueData() {
    return this.getSettingsDetails().element(by.css('#labelValueData'));
  }

  getLabelValueNoData() {
    return this.getSettingsDetails().element(by.css('#labelValueNoData'));
  }

  getInputKeyData() {
    return this.getSettingsDetails().element(by.css('#inputKeyData'));
  }

  getInputKeyNoData() {
    return this.getSettingsDetails().element(by.css('#inputKeyNoData'));
  }

  getInputValueData() {
    return this.getSettingsDetails().element(by.css('#inputValueData'));
  }

  getInputValueNoData() {
    return this.getSettingsDetails().element(by.css('#inputValueNoData'));
  }
}
