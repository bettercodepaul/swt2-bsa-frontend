import { browser, by, element } from 'protractor';

export class Support {
  navigateToHome() {
    return browser.get('/home');
  }

  getSupport() {
    return element(by.css('#footer'));
  }

  getParagraph() {
    return this.getSupport().all(by.css('p')).getText();
  }

  getLogos() {
    return this.getSupport().all(by.css('img'));
  }
}
