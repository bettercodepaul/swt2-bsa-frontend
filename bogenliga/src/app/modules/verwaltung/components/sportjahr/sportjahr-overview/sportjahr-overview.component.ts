import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Response} from '../../../../shared/data-provider';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {
  Notification, NotificationOrigin, NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {SPORTJAHR_LIGA_AUSWAHL_CONFIG} from './sportjahr-overview.config';
import {SportjahrDataProviderService} from '../../../services/sportjahr-data-provider.service';
import {NOTIFICATION_DELETE_DSB_MANNSCHAFT} from '../../dsb-mannschaft/dsb-mannschaft-overview/dsb-mannschaft-overview.component';
import {SportjahrDTO} from '../../../types/datatransfer/sportjahr-dto.class';
import {isUndefined} from "util";
import {DsbMannschaftDO} from '../../../types/dsb-mannschaft-do.class';

export const NOTIFICATION_DELETE_SPORTJAHR = 'sportjahr_overview_delete';

@Component({
  selector: 'bla-sportjahr-overview',
  templateUrl: './sportjahr-overview.component.html',
  styleUrls: ['./sportjahr-overview.component.scss']
})
export class SportjahrOverviewComponent extends CommonComponent  implements OnInit {

  public config = SPORTJAHR_LIGA_AUSWAHL_CONFIG;
  public rows: TableRow[];

  constructor(private sportjahrDataProvider: SportjahrDataProviderService, private router: Router, private notificationService: NotificationService, private route: ActivatedRoute,) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!isUndefined(params["id"])) {
        const id = params["id"];
        this.loadTableRows(id);
        }
      });
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }


  public onDelete(any: any): void {}
  /*
  public onDelete(versionedDataObject: VersionedDataObject): void {
    // show loading icon
    const id = versionedDataObject.id;

    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_DSB_MANNSCHAFT + id,
      title:            'MANAGEMENT.DSBMANNSCHAFT.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.DSBMANNSCHAFT.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MANNSCHAFT + id)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.sportjahrDataProvider.deleteById(id)
                .then(response => this.loadTableRows())
                .catch(response => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);

  }
  */

  private loadTableRows(id : number) {
    this.loading = true;

    this.sportjahrDataProvider.findAllByLigaId(id)
        .then((response: Response<SportjahrDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<SportjahrDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/sportjahr/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: Response<SportjahrDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<SportjahrDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
