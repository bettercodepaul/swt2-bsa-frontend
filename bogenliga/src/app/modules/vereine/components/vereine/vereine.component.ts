import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {isNullOrUndefined} from '@shared/functions';
import {VereinDO} from '@vereine/types/verein-do.class';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {CommonComponent, showDeleteLoadingIndicatorIcon, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {MatchDataProviderService} from '@vereine/services/match-data-provider.service';
import {MatchDTO} from '@vereine/types/datatransfer/match-dto.class';
import {WettkampfDataProviderService} from '@vereine/services/wettkampf-data-provider.service';
import {WettkampfDTO} from '@vereine/types/datatransfer/wettkampf-dto.class';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {NOTIFICATION_DELETE_BENUTZER} from '@verwaltung/components';

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
  public loadingVereine = true;
  public loadingTable = false;
  public rows: TableRow[];
  private selectedVereinsId : number;
  private tableContent: Array<WettkampfDTO> = [];
  private remainingRequests : number = 0;

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadVereine();
  }

  public onSelect($event: VereinDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    this.selectedVereinsId = this.selectedDTOs[0].id;
    this.rows = [];
    this.tableContent = [];
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

  private loadVereine(): void {
    this.vereine = [];
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload;  this.loadingVereine = false; })
        .catch((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload; });
  }



  private loadTableRows() {
    this.loadingTable = true;
    this.mannschaftsDataProvider.findAllByVereinsId(this.selectedVereinsId)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleFindMannschaftenSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleFindMannschaftenFailure(response));
   }

  private handleFindMannschaftenFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = [];
    this.loadingTable = false;
  }

  private handleFindMannschaftenSuccess(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    //this.rows = toTableRows(response.payload);
    let i: number = 0;
    for(i;i< response.payload.length;i++) {
      let mannschaftsId: string = this.selectedDTOs[0].name +" "+ response.payload[i].nummer +". Mannschaft";
      this.matchDataProvider.findAllbyMannschaftsID(107)
          .then((response: BogenligaResponse<MatchDTO[]>) => this.handleFindMatchSuccess(response,mannschaftsId))
          .catch((response: BogenligaResponse<MatchDTO[]>) => this.handleFindMatchFailure(response));

    }
  }

  private handleFindMatchFailure(response: BogenligaResponse<MatchDTO[]>): void {
  }

  private handleFindMatchSuccess(response: BogenligaResponse<MatchDTO[]>, mannschaftsId: string): void {
   this.remainingRequests = response.payload.length;
    for (let i: number = 0; response.payload.length; i++) {
      this.wettkampfDataProvider.findById(response.payload[i].wettkampfId)
          .then((response: BogenligaResponse<WettkampfDTO>) => this.handleFindWettkampfSuccess(response, mannschaftsId))
          .catch((response: BogenligaResponse<WettkampfDTO>) => this.handleFindWettkampfFailure(response));

    }
  }

  private handleFindWettkampfSuccess(response: BogenligaResponse<WettkampfDTO>, mannschaftsID: string): void {
    response.payload.wettkampfBeginn = mannschaftsID;
    this.tableContent.push(response.payload);
    this.remainingRequests -= 1;
    console.log(this.remainingRequests);
    if(this.remainingRequests <= 0) {
      let contentArray: WettkampfDTO[] = this.tableContent;
      this.rows = toTableRows(contentArray);
      this.loadingTable = false;
    }
  }

  private handleFindWettkampfFailure(response: BogenligaResponse<WettkampfDTO>): void {
    console.log(response.payload);
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    //this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    //this.navigateToDetailDialog(versionedDataObject);
  }


  public onDelete(versionedDataObject: VersionedDataObject): void {
    // show loading icon
    // const id = versionedDataObject.id;
    //
    // this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);
    //
    // const notification: Notification = {
    //   id:               NOTIFICATION_DELETE_BENUTZER + id,
    //   title:            'MANAGEMENT.BENUTZER.NOTIFICATION.DELETE.TITLE',
    //   description:      'MANAGEMENT.BENUTZER.NOTIFICATION.DELETE.DESCRIPTION',
    //   descriptionParam: '' + id,
    //   severity:         NotificationSeverity.QUESTION,
    //   origin:           NotificationOrigin.USER,
    //   type:             NotificationType.YES_NO,
    //   userAction:       NotificationUserAction.PENDING
     };
}

