import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {isNullOrUndefined} from '@shared/functions';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VereinDTO} from '../../../verwaltung/types/datatransfer/verein-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {WettkampfDataProviderService} from '../../../verwaltung/services/wettkampf-data-provider.service';
import {WettkampfDTO} from '../../../verwaltung/types/datatransfer/wettkampf-dto.class';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {VeranstaltungDataProviderService} from '../../../verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '../../../verwaltung/types/datatransfer/veranstaltung-dto.class';
import {VereinTabelleDO} from '@vereine/types/vereinsTabelle-do.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services/notification';


const ID_PATH_PARAM = 'id';

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html',
  styleUrls: ['./vereine.component.scss'],
})
export class VereineComponent extends CommonComponent implements OnInit {

  public PLACEHOLDER_VAR = 'Bitte Verein eingeben...';
  public config = VEREINE_CONFIG;
  public config_table = VEREINE_TABLE_CONFIG;
  public selectedDTOs: VereinDO[];
  public multipleSelections = true;
  public vereine: VereinDO[];
  public loadingVereine = true;
  public loadingTable = false;
  public rows: TableRow[];
  private selectedVereinsId: number;
  private remainingRequests: number;
  private remainingMannschaftsRequests: number;
  private tableContent: Array<VereinTabelleDO> = [];
  private providedID: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService) {
    super();
  }

  ngOnInit() {
    console.log('Bin in Vereine');
    this.loadVereine();
    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.providedID = params[ID_PATH_PARAM];
        console.log("This.providedID: " + this.providedID);

      }
    });
  }


  // gets used by vereine.componet.html to show the selected vereins-name
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

  public onView(versionedDataObject: VersionedDataObject): void {

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
  }

  public onDownload($event: WettkampfDO): void {

    const str = $event.wettkampfOrt;
    let splits: string[];
    splits = str.split(', ', 5);
    const locationUrl = 'https://www.google.de/maps/place/' + splits[0] + '+' + splits[1] + '+' + splits[2];
    window.open(locationUrl);

  }
  // backend-call to get the list of vereine
  private loadVereine(): void {
    this.vereine = [];
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload;  this.loadingVereine = false; })
        .catch((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload; });
  }

  // starts the backend-calls to search for the table content
  // table date will be loaded backwards (from right to left)
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
    let i: number;
    this.remainingMannschaftsRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingTable = false;
    }
    for (i = 0; i < response.payload.length; i++) {
      const mannschaftsName: string = this.selectedDTOs[0].name + ' ' + response.payload[i].nummer + '. Mannschaft';
      this.wettkampfDataProvider.findAllWettkaempfeByMannschaftsId(response.payload[i].id)
          .then((responseb: BogenligaResponse<WettkampfDTO[]>) => this.handleFindWettkaempfeSuccess(responseb, mannschaftsName))
          .catch((responseb: BogenligaResponse<WettkampfDTO[]>) => this.handleFindWettkaempfeFailure(responseb));

    }
  }

  private handleFindWettkaempfeFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.rows = [];
    this.loadingTable = false;
  }

  private handleFindWettkaempfeSuccess(response: BogenligaResponse<WettkampfDTO[]>, mannschaftsName: string): void {
    console.log('success');
    this.remainingRequests = response.payload.length;
    this.remainingMannschaftsRequests -= 1;
    if (response.payload.length <= 0) {
      this.loadingTable = false;
    }
    for (const wettkampf of response.payload) {
      const wettkampfTag: string = wettkampf.wettkampfTag + '. Wettkampftag';
      const wettkampfOrt: string = wettkampf.wettkampfOrt;
      this.veranstaltungsDataProvider.findById(wettkampf.wettkampfVeranstaltungsId)
          .then((responseb: BogenligaResponse<VeranstaltungDTO>) => this.handleFindVeranstaltungSuccess(responseb, mannschaftsName, wettkampfTag, wettkampfOrt ))
          .catch((responseb: BogenligaResponse<VeranstaltungDTO>) => this.handleFindVeranstaltungFailure(responseb));
    }
    if (response.payload.length === 0) {
      const tableContentRow: VereinTabelleDO = new VereinTabelleDO('' , '', '' , mannschaftsName);
      this.tableContent.push(tableContentRow);
    }
    if (this.remainingMannschaftsRequests <= 0) {
      this.rows = toTableRows(this.tableContent);
    }

  }
  private handleFindVeranstaltungFailure(response: BogenligaResponse<VeranstaltungDTO>): void {
    this.rows = [];
    this.loadingTable = false;
  }

  private handleFindVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDTO>, mannschaftsName: string, wettkampfTag: string, wettkampfOrt: string): void {
    console.log('Content:' + response.payload.name + wettkampfTag +  mannschaftsName);
    const tableRowContent: VereinTabelleDO = new VereinTabelleDO(response.payload.name, wettkampfTag, wettkampfOrt, mannschaftsName);
    this.tableContent.push(tableRowContent);
    this.remainingRequests -= 1;

    // if this is the last request, put the collected content into the table
    if (this.remainingRequests <= 0) {
      this.rows = toTableRows(this.tableContent);
      this.tableContent = [];
      this.loadingTable = false;
    }
  }
}

