import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponent} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {Response} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {SPORTJAHR_LIGA_AUSWAHL_CONFIG} from './sportjahr-liga-auswahl.config';

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
        .catch((response: Response<LigaDTO[]>) => this.handleLoadTableRowsFailure(response));
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
