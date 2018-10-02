import { browser, by, element } from 'protractor';

export class Footer {
  navigateToHome() {
    return browser.get('/home');
  }

  getFooter() {
    return element(by.css('#footer'));
  }

  getLinks() {
    return this.getFooter().all(by.css('li'));
  }

  getKontakt() {
    return this.getLinks().get(0).getText();
  }

  getImpressumUndDatenschutz() {
    return this.getLinks().get(1).getText();
  }
}
