import {Component, OnInit, HostListener} from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from '../../types/data';

import { ViewChildren, QueryList, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'bla-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./../../../../app.component.scss',
                    './overview.component.scss'],
  providers: [ TranslatePipe ]
})
export class OverviewComponent implements OnInit, AfterViewInit {
  // pages of the pagination -> overview.component.html
  @ViewChildren('pages') pages: QueryList<ElementRef>; // https://angular.io/api/core/ViewChild

  datas: Data[] = []; // data for table
  keyAufsteigend = false; // if sorted with key aufsteigend
  valueAufsteigend = false; // if sorted with value aufsteigend

  activePage = 1; // number of current page
  pageCount: Array<any> = [1, 2]; // link to the pages
  maxOnPage = 10; // how many items can be shown on the page
  first = 0; // first item index on page
  last = this.maxOnPage - 1; // last item index on page

  @HostListener('click', ['$event']) onclick(event: any) { // https://angular.io/api/core/HostListener
    if (event.target.parentElement.innerText >= 1 || event.target.parentElement.innerText <= 3) {
      (this.activePage as number) = +event.target.parentElement.innerText;
      // clears active from all pages and adds it only to current page
      this.clearActive();
      this.renderer.addClass(event.target.parentElement, 'active');
    }
    // Calculate first and last item of page
    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1 - 1;
    this.last = +this.activePage * this.maxOnPage - 1;
  }

  constructor(private renderer: Renderer2, private el: ElementRef, private dataService: DataService) { }

  ngOnInit() {
    this.getData();
  }

  /**
   * makes sure only first page is labeld active
   * sets active page to first page
   * calculates first and last item on the page
   */
  ngAfterViewInit() {
    this.clearActive();
    if (this.pages.length > 0) {
      this.renderer.addClass(this.pages.first.nativeElement, 'active');
    }
    this.activePage = 1;
    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1 - 1;
    this.last = +this.activePage * this.maxOnPage - 1;
  }

  /**
   *gets Data from the Service for the Table
   * sorts it by key
   * calculates pagination
   */
  getData(): void {
    // this.dataService.getData().subscribe(datas => this.datas = datas);
    this.dataService.findAll().subscribe(datas => {
      this.datas = datas;
      this.sortDataByKey();
      // this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.calculatePagination(this.datas.length);
      // if last object of last page is deleted -> change to one page before
      if (this.activePage > this.pageCount.length) {
        this.activePage = this.activePage - 1;
        this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1 - 1;
        this.last = +this.activePage * this.maxOnPage - 1;
      }
    });
  }

  /**
   * counts how many pages are needed
   * makes an array with the page numbers
   * @param datacount
   */
  calculatePagination(datacount: number) {
    const pages = Math.ceil(datacount / this.maxOnPage); // Math.ceil always gives back same ore higher number -> 7.03 is 8
    const pagination = new Array(pages);
    for (let i = 0; i < pagination.length; i++) {
      pagination[i] = i + 1;
    }
    this.pageCount = pagination;
  }

  /**
   * uses key (character) of the data to sort the array
   * either from lowest to highest
   * or highest to lowest
   */
  sortDataByKey(): void {
    if (this.keyAufsteigend === false) {
      this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.valueAufsteigend = false;
      this.keyAufsteigend = true;
    } else {
      this.datas.sort((b, a) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.valueAufsteigend = false;
      this.keyAufsteigend = false;
    }
  }

  /**
   * uses value (number) of the data to sort the array
   * either from lowest to highest
   * or highest to lowest
   */
  sortDataByValue(): void {
    if (this.valueAufsteigend === false) {
      this.datas.sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.keyAufsteigend = false;
      this.valueAufsteigend = true;
    } else {
      this.datas.sort((b, a) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.keyAufsteigend = false;
      this.valueAufsteigend = false;
    }
  }

  /**
   * makes sure no page is labeled active
   */
  clearActive() {
    if (this.pages.length > 0) {
      this.pages.forEach(element => {
        this.renderer.removeClass(element.nativeElement, 'active');
      });
    }
  }

  /**
   * sets first page to first item of pages
   * makes sure only first class is active
   * calculates first and last item of first page
   * activated when link to first page is used
   */
  firstPage() {
    this.clearActive();
    if (this.pages.length > 0) {
      const firstPage = this.pages.first.nativeElement;
      (this.activePage as number) = +firstPage.innerText;
      this.clearActive();
      this.renderer.addClass(firstPage, 'active');
    }
    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1;
    this.last = +this.activePage * this.maxOnPage;
  }

  /**
   * sets last page to last item of pages
   * makes sure only last class is active
   * calculates first and last item of last page
   * activated when link to last page is used
   */
  lastPage() {
    this.clearActive();
    if (this.pages.length > 0) {
      const lastPage = this.pages.last.nativeElement;
      (this.activePage as number) = +lastPage.innerText;
      this.clearActive();
      this.renderer.addClass(lastPage, 'active');
    }
    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1;
    this.last = +this.activePage * this.maxOnPage;
  }

  /**
   * deletes data in this row
   * calls service
   * gets data from database
   * @param key
   */
  deleteThisData(key: string): void {
    this.dataService.deleteById(key).subscribe(data => {
      this.getData();
    });
  }
}
