import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {EINSTELLUNGEN_OVERVIEW_CONFIG} from './einstellungen-overview.config';

@Component({
  selector: 'bla-einstellungen-overview',
  templateUrl: './einstellungen-overview.component.html',
  styleUrls: ['./einstellungen-overview.component.scss']
})
export class EinstellungenOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = EINSTELLUNGEN_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private router: Router, private notificationService: NotificationService) {
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
    // TODO
   }

  private loadTableRows() {
  }


  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/einstellungen/' + versionedDataObject.id);
  }
}
