import {Component, OnInit} from '@angular/core';
import {DSB_MITGLIED_DETAIL_CONFIG} from './dsb-mitglied-detail.config';
import {Response} from '../../../../shared/data-provider';
import {CommonComponent, FormContent, toFormContent} from '../../../../shared/components';
import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';

const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-dsb-mitglied-detail',
  templateUrl: './dsb-mitglied-detail.component.html',
  styleUrls:   ['./dsb-mitglied-detail.component.scss']
})
export class DsbMitgliedDetailComponent extends CommonComponent implements OnInit {

  public config = DSB_MITGLIED_DETAIL_CONFIG;

  public currentMitglied: FormContent;

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
    private router: Router,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentMitglied = toFormContent(new DsbMitgliedDO());
        } else {
          this.dsbMitgliedDataProvider.findById2(params[ID_PATH_PARAM])
              .then((response: Response<DsbMitgliedDO>) => this.handleSuccess(response))
              .catch((response: Response<DsbMitgliedDO>) => this.handleFailure(response));
        }
      }
    });
  }

  private handleSuccess(response: Response<DsbMitgliedDO>) {
    this.currentMitglied = toFormContent(response.payload);
  }

  private handleFailure(response: Response<DsbMitgliedDO>) {

  }
}
