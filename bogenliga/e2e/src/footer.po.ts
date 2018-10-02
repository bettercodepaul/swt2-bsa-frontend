import { browser, by, element } from 'protractor';

export class Footer {
  navigateToHome() {
    return browser.get('/home');
  }

  getFooter() {
    return element(by.css('#footer'));
  }

  getFlexContainer() {
    return this.getFooter().element(by.css('.flexContainer'));
  }

  getLinks() {
    return this.getFooter().element(by.css('ul'));
  }

  getKontakt() {
    return this.getLinks().all(by.css('li')).get(0).getText();
  }

  getImpressum() {
    return this.getLinks().all(by.css('li')).get(1).getText();
  }

  getHeading() {
    return this.getFooter().element(by.css('h3')).getText();
  }

  getParagraph() {
    return this.getFooter().element(by.css('p')).getText();
  }

  getImage() {
    return this.getFooter().element(by.css('img'));
  }
}
