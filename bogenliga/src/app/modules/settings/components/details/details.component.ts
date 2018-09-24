import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from './../../types/data';
import {TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';

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
  // settingsKey: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getData();
    this.initDialog();
    this.dataIndex = this.dataService.getIndexSelectedData();
  }

  /**
   * get Data for the table from the service
   * uses the one on the index or none
   */
  getData(): void {
    this.dataService.getData().subscribe(datas => this.datas = datas);
  }

  private initDialog(): void {
    this.route.params.subscribe(params => {
      let settingsKey;
      if (!isUndefined(params['key'])) {
        settingsKey = params['key'];
        console.log(settingsKey);
      }
    });
  }
}
