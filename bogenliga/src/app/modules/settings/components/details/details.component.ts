import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from './../../types/data';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'bla-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss',
        './../../../../app.component.scss'],
  providers: [ TranslatePipe, TranslateModule ]
})
export class DetailsComponent implements OnInit {

  dataIndex = -1;
  datas: Data[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getData();
    this.dataIndex = this.dataService.getIndexSelectedData();
  }

  /**
   * get Data for the table from the service
   * uses the one on the index or none
   */
  getData(): void {
    this.dataService.getData().subscribe(datas => this.datas = datas);
  }

}
