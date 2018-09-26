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
  @ViewChildren('pages') pages: QueryList<ElementRef>;

  datas: Data[] = []; // data for table
  keyAufsteigend = true; // if sorted with key aufsteigend
  valueAufsteigend = false; // if sorted with value aufsteigend

  activePage: number; // number of current page
  pageCount: Array<any> = [1, 2]; // link to the pages
  maxOnPage = 10; // how many items can be shown on the page
  first = 0; // first item index on page
  last = this.maxOnPage - 1; // last item index on page

  @HostListener('click', ['$event']) onclick(event: any) {
    if (event.target.parentElement.innerText >= 1 || event.target.parentElement.innerText <= 3) {
      (this.activePage as number) = +event.target.parentElement.innerText;
      this.clearActive();
      this.renderer.addClass(event.target.parentElement, 'active');
    }
    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1 - 1;
    this.last = +this.activePage * this.maxOnPage - 1;
  }

  constructor(private renderer: Renderer2, private el: ElementRef, private dataService: DataService) { }

  /**
   * gets Data and sorts it from lowest to highest key
   * sets Index of selected Item to -1 -> none selected
   */
  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    this.clearActive();
    this.renderer.addClass(this.pages.first.nativeElement, 'active');
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
      this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.calculatePagination(this.datas.length);
      // if last object of last page is deletet -> change to one page bevore
      if (this.activePage > this.pageCount.length) {
        this.activePage = this.activePage - 1;
        this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1 - 1;
        this.last = +this.activePage * this.maxOnPage - 1;
      }
    });
  }

  /**
   * counts how many pages are needed
   * makes an array with the pagenumbers
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
    if (this.valueAufsteigend === true) {
      this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.valueAufsteigend = false;
      this.keyAufsteigend = false;
    } else {
      this.datas.sort((b, a) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.valueAufsteigend = true;
      this.keyAufsteigend = false;
    }
  }

  /**
   * uses value (number) of the data to sort the array
   * either from lowest to highest
   * or highest to lowest
   */
  sortDataByValue(): void {
    if (this.keyAufsteigend === true) {
      this.datas.sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.keyAufsteigend = false;
      this.valueAufsteigend = false;
    } else {
      this.datas.sort((b, a) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.keyAufsteigend = true;
      this.valueAufsteigend = false;
    }
  }

  clearActive() {
    this.pages.forEach(element => {
      this.renderer.removeClass(element.nativeElement, 'active');
    });
  }

  firstPage() {
    this.clearActive();
    const firstPage = this.pages.first.nativeElement;
    (this.activePage as number) = +firstPage.innerText;
    this.clearActive();
    this.renderer.addClass(firstPage, 'active');

    this.first = +this.activePage * this.maxOnPage - this.maxOnPage + 1;
    this.last = +this.activePage * this.maxOnPage;
  }

  lastPage() {
    this.clearActive();
    const lastPage = this.pages.last.nativeElement;
    (this.activePage as number) = +lastPage.innerText;
    this.clearActive();
    this.renderer.addClass(lastPage, 'active');

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
    this.dataService.deleteByKey(key).subscribe(data => {
      this.getData();
    });
  }
}
