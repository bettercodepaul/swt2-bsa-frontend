import { Component, OnInit, Input, EventEmitter, OnDestroy, HostListener } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from './../../types/data';

import { ViewChildren, QueryList, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {RoutingModule} from '../../../../routing.module';


@Component({
  selector: 'bla-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./../../../../app.component.scss',
                    './overview.component.scss'],
  providers: [ TranslatePipe ]
})
export class OverviewComponent implements OnInit, AfterViewInit {
  @ViewChildren('pages') pages: QueryList<ElementRef>;

  datas: Data[];
  keyAufsteigend = true;
  valueAufsteigend = false;

  activePage: number;
  pageCount: Array<any> = [1, 2, 3, 4]; // link to the pages
  maxOnPage = 8; // how many items can be shown on the page
  first = 0;
  last = this.maxOnPage - 1;

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
    this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
    this.dataService.setIndexSelectedData(-1);
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
   */
  getData(): void {
    this.dataService.getData().subscribe(datas => this.datas = datas);
  }

  /**
   * uses key (number) of the data to sort the array
   * either from lowest to highest
   * or highest to lowest
   */
  sortDataByKey(): void {
    if (this.keyAufsteigend === true) {
      this.datas.sort((b, a) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.keyAufsteigend = false;
      this.valueAufsteigend = false;
    } else {
      this.datas.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
      this.keyAufsteigend = true;
      this.valueAufsteigend = false;
    }
  }

  /**
   * uses value (character) of the data to sort the array
   * either from lowest to highest
   * or highest to lowest
   */
  sortDataByValue(): void {
    if (this.valueAufsteigend === true) {
      this.datas.sort((b, a) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.valueAufsteigend = false;
      this.keyAufsteigend = false;
    } else {
      this.datas.sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      this.valueAufsteigend = true;
      this.keyAufsteigend = false;
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
   * Hands index of selected item over to service
   * @param data
   */
  onSelect(data: number): void {
    this.dataService.setIndexSelectedData(data);
  }
}
