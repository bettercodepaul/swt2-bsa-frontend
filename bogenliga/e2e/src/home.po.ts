import { browser, by, element } from 'protractor';

export class HomePage {
  navigateToHome() {
    return browser.get('/home');
  }

  getHome() {
    return element(by.css('.homePage'));
  }

  /* Heading */
  getHomeHeading() {
    return this.getHome().element(by.css('.homeHeading')).getText();
  }

  getHomeParagraph() {
    return this.getHome().element(by.css('.homeText')).getText();
  }

  /* Body */
  getFlexChildren() {
    return this.getHome().all(by.css('flexChild'));
  }

  /* Table */
  getUnsereWettkaempfe() {
    return this.getHome().element(by.css('table'));
  }

  getTableHeader() {
    return this.getHome().all(by.tagName('tr')).get(0).getText();
  }

  getTableRow() {
    return this.getHome().all(by.tagName('tr'));
  }

  getFirstRowData() {
    return this.getTableRow().get(1).getText();
  }

  getLastRowData() {
    return this.getTableRow().last().getText();
  }
}
