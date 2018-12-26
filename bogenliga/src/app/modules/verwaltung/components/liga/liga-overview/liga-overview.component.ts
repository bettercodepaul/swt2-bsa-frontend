import { Component, OnInit } from '@angular/core';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {LIGA_OVERVIEW_CONFIG} from './liga-overview.config';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../shared/services/notification';
import {Response} from '../../../../shared/data-provider';
import {WettkampfKlasseDTO} from '../../../types/datatransfer/wettkampfklasse-dto.class';

@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent implements OnInit {

  public config = LIGA_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private ligaDataProvider: LigaDataProviderService, private router: Router, private notificationService: NotificationService) {
   // super();
  }

  ngOnInit() {
    this.loadTableRows();
  }

  private loadTableRows() {
    this.loading = true;

    this.ligaDataProvider.findAll()
        .then((response: Response<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsFailure(response))
  }

}
