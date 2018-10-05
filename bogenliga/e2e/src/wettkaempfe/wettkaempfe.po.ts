import { browser, by, element } from 'protractor';

export class Wettkaempfe {
  navigateToWettkaempfe() {
    return browser.get('/wettkaempfe');
  }

  getWettkaempfe() {
    return element(by.css('#wettkaempfe'));
  }

  /* Heading */
  getHeading() {
    return this.getWettkaempfe().element(by.css('h1')).getText();
  }

  /* Table Wettkaempfe */
  getWettkampfeTable() {
    return this.getWettkaempfe().element(by.css('wettkaempfeTabelle'));
  }

  getWettkampfeTableHeader() {
    return this.getWettkaempfe().all(by.tagName('tr')).get(0).getText();
  }

  getWettkampfeTableRow() {
    return this.getWettkaempfe().all(by.tagName('tr'));
  }

  getWettkampfeFirstRowData() {
    return this.getWettkampfeTableRow().get(1).getText();
  }

  getWettkampfeLastRowData() {
    return this.getWettkampfeTableRow().last().getText();
  }

  /* Table Wettkaempfe */
  getTitleLegende() {
    return this.getWettkaempfe().element(by.css('h3')).getText();
  }

  getLegendsTable() {
    return this.getWettkaempfe().element(by.css('wettkaempfeTabelle'));
  }

  getLegendsTableHeader() {
    return this.getWettkaempfe().all(by.tagName('tr')).get(0).getText();
  }

  getLegendsTableRow() {
    return this.getWettkaempfe().all(by.tagName('tr'));
  }

  getLegendsFirstRowData() {
    return this.getLegendsTableRow().get(1).getText();
  }

  getLegendsLastRowData() {
    return this.getLegendsTableRow().last().getText();
  }
}
