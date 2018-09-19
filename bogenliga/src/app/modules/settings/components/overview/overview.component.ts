import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.datas = this.dataService.getData();
  }

}
