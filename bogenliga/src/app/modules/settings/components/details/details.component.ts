import {Component, OnInit} from '@angular/core';

import {Data} from '../../types/data';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';

import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {SettingsDataProviderService} from '../../services/settings-data-provider.service';
import {Response} from '../../../shared/data-provider';

@Component({
  selector:    'bla-details',
  templateUrl: './details.component.html',
  styleUrls:   [
    './details.component.scss',
    './../../../../app.component.scss'
  ],
  providers:   [TranslatePipe, TranslateModule]
})
export class DetailsComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  dataSelected = false; // is data selceted -> chooses view
  data: Data = new Data();
  dataKey = ''; // key for url -> which data is selected
  private destinationRouteAfterDelete = '/settings/overview';

  constructor(private dataService: SettingsDataProviderService, private route: ActivatedRoute, private router: Router) {
  }

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

  /**
   * Add new data to database
   * calls service
   * resets data of this for next input
   */
  public saveNewData(): void {
    this.dataService.addOne(new Data(this.data.key, this.data.value)).then(((response: Response<Data>) => console.log('Setting persisted')));
    this.data = new Data()
  }

  /**
   * updates already existing data in database
   * calls service
   */
  saveData(): void {
    this.dataService.update(this.data).then(((response: Response<Data>) => console.log('Setting updated')));
  }

  /**
   * delete selected data from database
   * calls service
   */
  deleteThisData(): void {
    this.dataService.deleteById(this.dataKey).then((response: Response<void>) => {
      console.log('Setting deleted');
      this.router.navigateByUrl(this.destinationRouteAfterDelete);
    });
  }

  private initDialog(): void {
    this.route.params.subscribe(params => {
      // if there is a key -> set dataKey to string, set data to selected object
      let settingsKey;
      if (!isUndefined(params['key'])) {
        settingsKey = params['key'];
        this.dataKey = settingsKey;
        this.dataService.findById(settingsKey).then((response: Response<Data>) => this.data = response.payload);
        this.dataSelected = true;
      }
    });
  }
}
