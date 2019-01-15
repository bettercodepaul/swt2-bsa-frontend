import {Component, OnInit} from '@angular/core';
import {WETTKAMPFKLASE_OVERVIEW_CONFIG} from './wettkampfklasse-overview.config';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {Response} from '../../../../shared/data-provider';
import {WettkampfKlasseDTO} from '../../../types/datatransfer/wettkampfklasse-dto.class';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {WettkampfklassenDataProviderService} from '../../../services/wettkampfklassen-data-provider.service';

@Component({
  selector: 'bla-wettkampfklasse-overview',
  templateUrl: './wettkampfklasse-overview.component.html',
  styleUrls: ['./wettkampfklasse-overview.component.scss']
})
export class WettkampfklasseOverviewComponent extends CommonComponent implements OnInit {

  public config = WETTKAMPFKLASE_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private wettkampfklassenDataProvider: WettkampfklassenDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }


  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    //TODO
   }

  private loadTableRows() {
    this.loading = true;

    this.wettkampfklassenDataProvider.findAll()
        .then((response: Response<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsFailure(response))
  }

  private handleLoadTableRowsFailure(response: Response<WettkampfKlasseDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<WettkampfKlasseDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/klassen/' + versionedDataObject.id);
  }
}
