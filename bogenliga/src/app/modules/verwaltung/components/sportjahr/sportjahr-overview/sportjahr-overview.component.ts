import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponent, toTableRows} from '@shared/components';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {Response} from '@shared/data-provider';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {isUndefined} from '@shared/functions';
import {NotificationService} from '@shared/services';
import {SportjahrDataProviderService} from '../../../services/sportjahr-data-provider.service';
import {SportjahrDTO} from '../../../types/datatransfer/sportjahr-dto.class';
import {SPORTJAHR_LIGA_AUSWAHL_CONFIG} from './sportjahr-overview.config';

@Component({
  selector: 'bla-sportjahr-overview',
  templateUrl: './sportjahr-overview.component.html',
  styleUrls: ['./sportjahr-overview.component.scss']
})
export class SportjahrOverviewComponent extends CommonComponent  implements OnInit {

  public config = SPORTJAHR_LIGA_AUSWAHL_CONFIG;
  public rows: TableRow[];

  constructor(private sportjahrDataProvider: SportjahrDataProviderService, private router: Router, private notificationService: NotificationService, private route: ActivatedRoute, ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params.id)) {
        const id = params.id;
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

  private loadTableRows(id: number) {
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
