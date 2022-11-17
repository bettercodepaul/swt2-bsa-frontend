import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {WettkampfklassenDataProviderService} from '../../../services/wettkampfklassen-data-provider.service';
import {WettkampfKlasseDTO} from '../../../types/datatransfer/wettkampfklasse-dto.class';
import {WETTKAMPFKLASE_OVERVIEW_CONFIG} from './wettkampfklasse-overview.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService} from '@shared/services';

@Component({
  selector:    'bla-wettkampfklasse-overview',
  templateUrl: './wettkampfklasse-overview.component.html',
  styleUrls:   ['./wettkampfklasse-overview.component.scss']
})
export class WettkampfklasseOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = WETTKAMPFKLASE_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermWettkampf';

  private sessionHandling: SessionHandling;

  constructor(private wettkampfklassenDataProvider: WettkampfklassenDataProviderService, private router: Router, private notificationService: NotificationService, private currentUserService: CurrentUserService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService);
  }

  ngOnInit() {
    this.loading = true;
    if (!localStorage.getItem(this.searchTerm)) {
      this.loadTableRows();
    }
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
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

   public findBySearch($event: string) {
     this.wettkampfklassenDataProvider.findBySearch($event)
         .then((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsSuccess(response))
         .catch((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsFailure(response));
   }

  private loadTableRows() {
    this.wettkampfklassenDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<WettkampfKlasseDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<WettkampfKlasseDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/klassen/' + versionedDataObject.id);
  }
}
