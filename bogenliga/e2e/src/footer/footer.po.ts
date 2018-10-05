import { browser, by, element } from 'protractor';

export class Footer {
  navigateToHome() {
    return browser.get('/home');
  }

  getFooter() {
    return element(by.css('#footer'));
  }

  isFooterPresent() {
    return browser.isElementPresent(this.getFooter());
  }

  getLinks() {
    return this.getFooter().all(by.css('li'));
  }

  getImpressumUndDatenschutz() {
    return this.getLinks().get(0).getText();
  }
}
