import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponentDirective, toTableRows} from '@shared/components';
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

import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '@shared/services/notification';
import {TableColumnConfig} from '@shared/components/tables/types/table-column-config.interface';
import {onMapService} from '@shared/functions/onMap-service';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {DsbMannschaftVerAndWettDo} from '@verwaltung/types/dsb-mannschaft-ver-and-wett-do';
import {DsbMannschaftVerAndWettDto} from '@verwaltung/types/datatransfer/dsb-mannschaft-ver-and-wett-dto';


const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-vereine',
  templateUrl: './vereine.component.html',
  styleUrls:   ['./vereine.component.scss'],
})
export class VereineComponent extends CommonComponentDirective implements OnInit {

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
  private typeOfTableColumn: string;
  private veranstaltungen: VeranstaltungDTO[];
  private mannschaften: DsbMannschaftDTO[];
  private sessionHandling: SessionHandling;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private vereinDataProvider: VereinDataProviderService,
    private mannschaftsDataProvider: DsbMannschaftDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

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


  // Changes the selectedVereine acording to the current selectedVereinsID.
  private changeSelectedVerein(): void {
    this.selectedVereine = [];

    this.vereinDataProvider.findById(this.selectedVereinsId)
        .then((response: BogenligaResponse<VereinDTO>) =>
          this.getVereinSuccess(response.payload))
        .catch((response: BogenligaResponse<VereinDTO>) =>
          console.log('Fehler im Verein laden')
        );
  }
  // sets currentVerein to response and pushes it on selectedVereine
  private getVereinSuccess(response: VereinDTO) {
    // console.log('response in getVerein: ' + response.name);
    this.currentVerein = response;
    this.selectedVereine.push(this.currentVerein);
    // console.log('CurrentVerein: ' + this.currentVerein);
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
      // console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));
      const names: string[] = [];

      this.selectedDTOs.forEach((item) => {
        names.push(item.name);
      });

      return names.join(', ');
    }
  }

  public onView(versionedDataObject: TableColumnConfig): void {

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
  }

  /**
   * Gets the type of a clicked column of the verein table
   * @params $event: TableColumnConfig which are the headings of the columns
   */
  public getSelectedColumn($event: TableColumnConfig): void {
    this.typeOfTableColumn = $event.propertyName;
  }

  /**
   * Gets all Veranstaltungen through a backend call
   */
  public getAllVeranstaltungen(): void {
    this.veranstaltungsDataProvider.findAllGeplantLaufend()
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
        this.veranstaltungen = response.payload;
      });
  }

  /**
   * Gets all Mannschaften through a backend call
   */
  public getAllMannschaften(): void {
    this.mannschaftsDataProvider.findAll()
      .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {
        this.mannschaften = response.payload;
      });
  }

  /**
   * Gets the values of a clicked row of the verein table
   * saves the name of Veranstaltung and Mannschaft
   *  saves the type of the clicked column
   * then: call linkPreperation with these parameters
   * @params $event: all the values in the table
   */
  public async getSelectedRow($event): Promise<void> {
    const rowValues = $event;
    const veranstaltungsName = rowValues.veranstaltung_name;
    const mannschaftsName = rowValues.mannschaftsName.replace('. Mannschaft', '');
    const type = this.typeOfTableColumn;

    this.linkPreperation(type, veranstaltungsName, mannschaftsName);
  }

  /**
   * based on the type gets the ID of either only veranstaltung or veranstaltung and mannschaft
   * then: call vereineLinking with these IDs
   * @param
   * type: string - type of the clicked column
   * veranstaltungsName: string -  value of Veranstaltung of the selected row
   * mannschaftsName: string -  value of the Mannschaft of the selected row
   */
  public linkPreperation(type: string, veranstaltungsName: string, mannschaftsName: string): void {
    const currentVeranstaltung = this.veranstaltungen.find((veranstalung: VeranstaltungDTO) => veranstalung.name === veranstaltungsName);
    if (type === 'veranstaltung_name') {
      this.vereineLinking(currentVeranstaltung.id.toString(10));
    } else if (type === 'mannschaftsName') {
      const currentMannschaft = this.mannschaften.find((mannschaft: DsbMannschaftDTO) => mannschaft.name === mannschaftsName);
      this.vereineLinking(currentVeranstaltung.id + '/' + currentMannschaft.id);
    }
  }

  /**
   * routes to Wettkaempfe
   * @param linkParameter: string - the ids of the values
   */
  public vereineLinking(linkParameter: string) {
    const link = '/wettkaempfe/' + linkParameter;
    this.router.navigateByUrl(link);
  }

  /**
   * Creates Link to Google Maps
   * Splits given Location at every comma and passes it to Google Maps
   * @param $event
   */
  public onMap($event: WettkampfDO): void {
    onMapService($event);
  }

  private loadVereine(): void {
    this.vereine = [];
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => {
          this.vereine = response.payload.sort();
          this.loadingVereine = false;
          this.selectedVereinsId = this.hasID ? this.providedID : response.payload[0].id;
          // console.log('This.selectedVereinsID: ' + this.selectedVereinsId);
          //this.changeSelectedVerein();
          //this.onSelect(this.selectedVereine);
        })
        .catch((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload; });
  }

  // starts the backend-calls to search for the table content
  // table date will be loaded backwards (from right to left)
  private loadTableRows() {
    this.loadingTable = true;
    this.handleTest()
    /*this.mannschaftsDataProvider.findAllByVereinsId(this.selectedVereinsId)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleFindMannschaftenSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleFindMannschaftenFailure(response));*/
   }

  private handleFindMannschaftenFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = [];
    this.loadingTable = false;
  }
  private handleTest(): void {
    this.mannschaftsDataProvider.findAllVerAndWettByVereinsId(this.selectedVereinsId)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {
          // Hier kannst du das Ergebnis der Methode processen
          this.processData(response);
        })
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleFindMannschaftenFailure(response));
  }

  private processData(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    if (response.payload.length <= 0) {
      this.loadingTable = false;
    }
    this.remainingRequests = response.payload.length;
    response.payload.forEach((item) => {
        this.handleFindVeranstaltungSuccess(item.veranstaltungName,item.vereinName + " " + item.mannschaftNummer,item.wettkampfTag,item.wettkampfOrtsname)
    });
  }
  /*
  private handleFindMannschaftenSuccess(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    let i: number;
    this.remainingMannschaftsRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingTable = false;
    }
    for (i = 0; i < response.payload.length; i++) {
      const mannschaftsName: string = response.payload[i].name + '. Mannschaft';
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
      const wettkampfOrtsname: string = wettkampf.wettkampfOrtsname;

      this.veranstaltungsDataProvider.findById(wettkampf.wettkampfVeranstaltungsId)
          .then((responseb: BogenligaResponse<VeranstaltungDTO>) => this.handleFindVeranstaltungSuccess(responseb, mannschaftsName, wettkampfTag, wettkampfOrtsname))
          .catch((responseb: BogenligaResponse<VeranstaltungDTO>) => this.handleFindVeranstaltungFailure(responseb));
    }
    if (response.payload.length === 0) {
      const tableContentRow: VereinTabelleDO = new VereinTabelleDO('' , '', mannschaftsName, '');
      this.tableContent.push(tableContentRow);
    }
    if (this.remainingMannschaftsRequests <= 0) {
      this.rows = toTableRows(this.tableContent);
    }

  }*/
  private handleFindVeranstaltungFailure(response: BogenligaResponse<VeranstaltungDTO>): void {
    this.rows = [];
    this.loadingTable = false;
  }

  private handleFindVeranstaltungSuccess(veranstaltungsname: string, mannschaftsName: string, wettkampfTag: string, wettkampfOrtsname: string): void {
    console.log('Content:' + veranstaltungsname + wettkampfTag +  mannschaftsName + wettkampfOrtsname);
    const tableRowContent: VereinTabelleDO = new VereinTabelleDO(veranstaltungsname, wettkampfTag+ '. Wettkampftag', mannschaftsName, wettkampfOrtsname);
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
