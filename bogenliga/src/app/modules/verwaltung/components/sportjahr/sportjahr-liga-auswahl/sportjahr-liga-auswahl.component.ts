import { Component, OnInit } from '@angular/core';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {toTableRows} from '../../../../shared/components/tables';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {NotificationService} from '../../../../shared/services/notification';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {Router} from '@angular/router';
import {Response} from '../../../../shared/data-provider';
import {SPORTJAHR_LIGA_AUSWAHL_CONFIG} from './sportjahr-liga-auswahl.config';
import {CommonComponent} from '../../../../shared/components/common';

@Component({
  selector: 'bla-sportjahr-liga-auswahl',
  templateUrl: './sportjahr-liga-auswahl.component.html',
  styleUrls: ['./sportjahr-liga-auswahl.component.scss']
})
export class SportjahrLigaAuswahlComponent extends CommonComponent implements OnInit {
  public config = SPORTJAHR_LIGA_AUSWAHL_CONFIG;
  public rows: TableRow[];

  constructor(private ligaDataProvider: LigaDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }


  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  private loadTableRows() {
    this.loading = true;

    this.ligaDataProvider.findAll()
        .then((response: Response<LigaDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<LigaDTO[]>) => this.handleLoadTableRowsFailure(response))
  }

  private handleLoadTableRowsFailure(response: Response<LigaDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<LigaDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/sportjahr/liga/' + versionedDataObject.id);
  }
}
