import { Component, OnInit, Input, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import {AppComponent} from '../../../../app.component';

import { DataService } from '../../services/data.service';
import { Data } from './../../types/data';

import { DATA } from './../../mock-data';

@Component({
  selector: 'bla-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss',
        './../../../../app.component.scss']
})
export class OverviewComponent implements OnInit {

  datas: Data[];
  keyAufsteigend = true;
  valueAufsteigend = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.datas = this.dataService.getData();
  }

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
}
