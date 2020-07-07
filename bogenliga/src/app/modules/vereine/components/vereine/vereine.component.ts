import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {BogenligaResponse, RequestResult} from '@shared/data-provider';
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

import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '@shared/services/notification';


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
  public selectedVereinsId: number;
  private selectedVereine: VereinDTO[];
  private remainingRequests: number;
  private remainingMannschaftsRequests: number;
  private tableContent: Array<VereinTabelleDO> = [];
  private providedID: number;
  private currentVerein: VereinDO;
  private hasID: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService) {
    super();
  }
  // If no ID is given, the ID 0 is used.
  // Otherwise the data of the selected Verein is displayed.
  ngOnInit() {
    console.log('Bin in Vereine');
    this.currentVerein = null;
    this.providedID = null;
    this.hasID = false;
    // this.providedID = this.findFirstVereinID();

    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.hasID = true;
        this.providedID = parseInt(params[ID_PATH_PARAM], 10);
        console.log('This.providedID: ' + this.providedID);
      }

    });
    this.loadVereine();
  }


  // Changes the selectedVereine acording to the current selectedVereinsID.
  private changeSelectedVerein(): void {
    this.selectedVereine = [];

    this.vereinDataProvider.findById(this.selectedVereinsId)
        .then((response: BogenligaResponse<VereinDTO>) =>
          this.getVereinSuccsess(response.payload))
        .catch((response: BogenligaResponse<VereinDTO>) =>
          console.log('Fehler im Verein laden')
        );
  }
  // sets currentVerein to response and pushes it on selectedVereine
  private getVereinSuccsess(response: VereinDTO) {
    console.log('response in getVerein: ' + response.name);
    this.currentVerein = response;
    this.selectedVereine.push(this.currentVerein);
    console.log('CurrentVerein: ' + this.currentVerein);
}

  // when a Verein gets selected from the list
  public onSelect($event: VereinDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedVereinsId = this.selectedDTOs[0].id;
    }
    this.changeVerein();
  }

  private changeVerein() {
    this.rows = [];
    this.tableContent = [];
    if (this.selectedVereinsId != null) {
      this.loadTableRows();
    }
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

  public onMap($event: WettkampfDO): void {

    const str = $event.wettkampfOrt;
    let splits: string[];
    splits = str.split(', ', 5);
    const locationUrl = 'https://www.google.de/maps/place/' + splits[0] + '+' + splits[1] + '+' + splits[2];
    window.open(locationUrl);

  }
  private loadVereine(): void {
    this.vereine = [];
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => {
          this.vereine = response.payload.sort();
          this.loadingVereine = false;
          this.selectedVereinsId = this.hasID ? this.providedID : response.payload[0].id;
          console.log('This.selectedVereinsID: ' + this.selectedVereinsId);
          this.changeSelectedVerein();
          this.onSelect(this.selectedVereine);
        })
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
