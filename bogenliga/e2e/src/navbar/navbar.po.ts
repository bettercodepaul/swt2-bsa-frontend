import { browser, by, element } from 'protractor';

export class Navbar {
  navigateToHome() {
    return browser.get('/home');
  }

  getNavbar() {
    return element(by.css('#navbar'));
  }

  isNavbarPresent() {
    return browser.isElementPresent(this.getNavbar());
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

  getLogin() {
    return this.getNavbar().element(by.css('.login'));
  }
}
