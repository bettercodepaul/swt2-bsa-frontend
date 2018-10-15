import { browser, by, element } from 'protractor';

// Propaply doesnt work because of right management

export class SettingsOverview {
  navigateToSettingsOverview() {
    return browser.get('/settings/overview');
  }

  getSettingsOverview() {
    return element(by.css('#settingsOverview'));
  }

  /* Heading */
  getHeading() {
    return this.getSettingsOverview().element(by.css('h1')).getText();
  }

  getAddButton() {
    return this.getSettingsOverview().element(by.css('#add'));
  }

  /* Table */
  getTable() {
    return this.getSettingsOverview().element(by.css('table'));
  }

  getTableHeader() {
    return this.getSettingsOverview().all(by.tagName('tr')).get(0).getText();
  }

  getTableRow() {
    return this.getSettingsOverview().all(by.tagName('tr'));
  }

  getFirstRowData() {
    return this.getTableRow().get(1).getText();
  }

  getLastRowData() {
    return this.getTableRow().last().getText();
  }

  getFirstDetailsButton() {
    return this.getTable().all(by.css('.detailsButton')).get(0);
  }



  /* Pagination */
  // tested in Unit Tests
}
