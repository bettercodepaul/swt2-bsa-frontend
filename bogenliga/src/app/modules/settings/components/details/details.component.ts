import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from '../../types/data';
import {TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';
import {catchError, map} from 'rxjs/operators';

@Component({
  selector: 'bla-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss',
        './../../../../app.component.scss'],
  providers: [ TranslatePipe, TranslateModule ]
})
export class DetailsComponent implements OnInit {

  dataSelected = false;
  data: Data = new Data();
  // settingsKey: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.getData();
    this.initDialog();
    // this.dataIndex = this.dataService.getIndexSelectedData();
  }

  /**
   * get Data for the table from the service
   * uses the one on the index or none
   */
  getData(): void {
    // this.dataService.getData().subscribe(datas => this.datas = datas);
    // this.dataService.findAll().subscribe(datas => this.datas = datas);
  }

  private initDialog(): void {
    this.route.params.subscribe(params => {
      let settingsKey;
      if (!isUndefined(params['key'])) {
        settingsKey = params['key'];
        console.log(settingsKey);
        this.dataService.findByKey(settingsKey).subscribe(data => this.data = data);
        this.dataSelected = true;
      }
    });
  }

  saveNewData(): void {
    this.dataService.addOne(new Data(this.data.key, this.data.value))
      .pipe(
        map(response => {
          const jsonObject = response.json();
          console.log(JSON.stringify(jsonObject));
        }),
        catchError(error => {
          console.log(error);
          return error;
        })
      );
  }
}
