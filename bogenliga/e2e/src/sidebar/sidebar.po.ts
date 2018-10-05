import { browser, by, element } from 'protractor';

export class Sidebar {
  navigateToHome() {
    return browser.get('/home');
  }

  getSidebar() {
    return element(by.css('#sidebar'));
  }

  isSidebarPresent() {
    return browser.isElementPresent(this.getSidebar());
  }

  getTitle() {
    return this.getSidebar().element(by.css('#title'));
  }

  isTitlePresent() {
    return browser.isElementPresent(this.getTitle());
  }

  getShortTitle() {
    return this.getSidebar().element(by.css('#shortTitle'));
  }

  isShortTitlePresent() {
    return browser.isElementPresent(this.getShortTitle());
  }

  getIcons() {
    return this.getSidebar().all(by.css('i'));
  }

  getIconHome() {
    return this.getIcons().get(0);
  }

  getIconVerwaltung() {
    return this.getIcons().get(1);
  }

  getIconWettkaempfe() {
    return this.getIcons().get(2);
  }

  getIconSportjahresplan() {
    return this.getIcons().get(3);
  }

  getSidebarText() {
    return this.getSidebar().all(by.css('.sidebar-text'));
  }

  isTextPresent() {
    return browser.isElementPresent(by.css('.sidebar-text'));
  }

  getTextHome() {
    return this.getSidebarText().get(0).getText();
  }

  getTextVerwaltung() {
    return this.getSidebarText().get(1).getText();
  }

  getTextWettkaempfe() {
    return this.getSidebarText().get(2).getText();
  }

  getTextSportjahresplan() {
    return this.getSidebarText().get(3).getText();
  }

  getButton() {
    return this.getSidebar().element(by.css('#sidebarCollapseBottom'));
  }

  clickButton() {
    browser.actions().mouseMove(this.getButton()).click().perform();
  }
}
