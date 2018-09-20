import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from './../../types/data';

@Component({
  selector: 'bla-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss',
        './../../../../app.component.scss']
})
export class DetailsComponent implements OnInit {

  dataIndex = -1;
  datas: Data[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getData();
    this.dataIndex = this.dataService.getIndexSelectedData();
    console.log(this.dataService.getIndexSelectedData());
  }

  getData(): void {
    this.dataService.getData().subscribe(datas => this.datas = datas);
  }

}
