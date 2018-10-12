import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Data } from '../../types/data';
import {TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';
import {catchError, delay, map} from 'rxjs/operators';

import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bla-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss',
        './../../../../app.component.scss'],
  providers: [ TranslatePipe, TranslateModule ]
})
export class DetailsComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  dataSelected = false; // is data selceted -> chooses view
  data: Data = new Data();
  dataKey = ''; // key for url -> which data is selected
  private destinationRouteAfterDelete = '/settings/overview';

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initDialog();
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
      // if there is a key -> set dataKey to string, set data to selected object
      let settingsKey;
      if (!isUndefined(params['key'])) {
        settingsKey = params['key'];
        this.dataKey = settingsKey;
        this.dataService.findById(settingsKey).subscribe(data => this.data = data);
        this.dataSelected = true;
      }
    });
  }

  /**
   * Add new data to database
   * calls service
   * resets data of this for next input
   */
  public saveNewData(): void {
    this.dataService.addOne(new Data(this.data.key, this.data.value)).subscribe();
    this.data = new Data()
  }

  /**
   * updates already existing data in database
   * calls service
   */
  saveData(): void {
    this.dataService.update(this.data).subscribe();
  }

  /**
   * delete selected data from database
   * calls service
   */
  deleteThisData(): void {
    this.dataService.deleteById(this.dataKey).subscribe(v => {
      this.router.navigateByUrl(this.destinationRouteAfterDelete);
    });
  }
}
