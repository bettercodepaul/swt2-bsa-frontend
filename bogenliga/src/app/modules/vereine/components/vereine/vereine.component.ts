import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {PlaygroundVersionedDataObject} from '../../../playground/components/playground/types/playground-versioned-data-object.class';
import {isNullOrUndefined} from '@shared/functions';
import {VereinDO} from '@vereine/types/verein-do.class';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {Router} from '@angular/router';
import {CommonComponent, showDeleteLoadingIndicatorIcon, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {NOTIFICATION_DELETE_VEREINE} from '@verwaltung/components';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {BenutzerDataProviderService} from '@verwaltung/services/benutzer-data-provider.service';
import {BenutzerDO} from '@verwaltung/types/benutzer-do.class';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '@user/types/model/user-profile-dto.class';

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html',
  styleUrls: ['./vereine.component.scss'],
})
export class VereineComponent extends CommonComponent implements OnInit {

  public config = VEREINE_CONFIG;
  public config_table = VEREINE_TABLE_CONFIG;
  public selectedDTOs: VereinDO[];
  public multipleSelections = true;
  private vereine : VereinDO[];
  public loading = true;
  public rows: TableRow[];
  private selectedVereinsId : number;

  constructor(private vereinDataProvider: VereinDataProviderService, private userDataProvider: UserProfileDataProviderService, private mannschaftsDataProvider: DsbMannschaftDataProviderService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.loadVereine();
    this.loading = false;
  }

  public onSelect($event: VereinDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    this.selectedVereinsId = this.selectedDTOs[0].id;
    console.log("Selected Vereins ID= "+this.selectedVereinsId);
    this.loadTableRows();
  }

  public getSelectedDTO(): string {
    if (isNullOrUndefined(this.selectedDTOs)) {
      return '';
    } else {
      console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));
      const names: string[] = [];

      this.selectedDTOs.forEach((item) => {
        names.push(item.name);
      });

      return names.join(', ');
    }
  }

  public getVersionedDataObjects(): VereinDO[] {
    return this.vereine;
  }

  public isLoading(): boolean {
    return this.loading;
  }

  private loadVereine(): void {

    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = []; this.vereine = response.payload;})
        .catch((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload; });
  }


  private loadTableRows() {
    this.loading = true;

    this.mannschaftsDataProvider.findAllByVereinsId(this.selectedVereinsId)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadTableRowsFailure(response));
    this.loading = false;
   }

  private handleLoadTableRowsFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    // this.navigateToDetailDialog(versionedDataObject);
  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    // this.navigateToDetailDialog(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    // show loading icon
    // const id = versionedDataObject.id;
    //
    // this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);
    //
    // const notification: Notification = {
    //   id:               NOTIFICATION_DELETE_VEREINE + id,
    //   title:            'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.TITLE',
    //   description:      'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.DESCRIPTION',
    //   descriptionParam: '' + id,
    //   severity:         NotificationSeverity.QUESTION,
    //   origin:           NotificationOrigin.USER,
    //   type:             NotificationType.YES_NO,
    //   userAction:       NotificationUserAction.PENDING
     };

}

