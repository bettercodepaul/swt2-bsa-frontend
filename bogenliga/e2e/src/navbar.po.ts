import { browser, by, element } from 'protractor';

export class Navbar {
  navigateToHome() {
    return browser.get('/home');
  }

  getNavbar() {
    return element(by.css('#navbar'));
  }

  getButton() {
    return this.getNavbar().all(by.css('button'));
  }

  getToggle() {
    return this.getNavbar().element(by.css('sidebarCollapseNavBar'));
  }

  getLogo() {
    return this.getNavbar().element(by.css('img'));
  }

  getTitel() {
    return this.getNavbar().element(by.css('h3')).getText();
  }

  getEn() {
    return this.getButton().get(1).getText();
  }

  getDe() {
    return this.getButton().get(2).getText();
  }

  getSettings() {
    return this.getButton().get(3);
  }
}
