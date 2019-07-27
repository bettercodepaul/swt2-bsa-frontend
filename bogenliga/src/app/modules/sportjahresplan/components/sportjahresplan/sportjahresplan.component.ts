import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonComponent, toTableRows} from '@shared/components';
import {SPORTJAHRESPLAN_CONFIG, WETTKAMPF_TABLE_CONFIG} from './sportjahresplan.config';
import {VeranstaltungDO} from "@verwaltung/types/veranstaltung-do.class";
import {VeranstaltungDTO} from "@verwaltung/types/datatransfer/veranstaltung-dto.class";
import {BogenligaResponse} from "@shared/data-provider";
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from "@vereine/services/wettkampf-data-provider.service";
import {TableRow} from "@shared/components/tables/types/table-row.class";
import {WettkampfDO} from "@vereine/types/wettkampf-do.class";
import {WettkampfDTO} from "@vereine/types/datatransfer/wettkampf-dto.class";
import {NotificationService} from '@shared/services/notification';



@Component({
  selector:    'bla-sportjahresplan',
  templateUrl: './sportjahresplan.component.html',
  styleUrls:   ['./sportjahresplan.component.scss']
})
export class SportjahresplanComponent extends CommonComponent implements OnInit {

  public config = SPORTJAHRESPLAN_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;


  public pdf = new Blob();


  private selectedVeranstaltungId: number;
  public selectedDTOs: VeranstaltungDO[];
  private selectedWettkampfId: number;
  public selectedWettkampfDTOs: WettkampfDO[];
  public multipleSelections = true;
  public veranstaltungen: VeranstaltungDO[];
  public loadingVeranstaltungen = true;
  public loadingWettkampfe = false;
  public rowsWettkampf: TableRow[];
  private tableContent: Array<WettkampfDO> = [];
  private remainingWettkampfRequests: number;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadVeranstaltungen();
  }



  // when a Veranstaltung gets selected from the list
  // load LigaTabelle
  public onSelect($event: VeranstaltungDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedVeranstaltungId = this.selectedDTOs[0].id;
    }
    this.rowsWettkampf = [];
    this.tableContent = [];
    if (this.selectedVeranstaltungId != null) {
      this.loadTableRows();
      }
  }

  // when a Wewttkampf gets selected from the list --> ID for Buttons

  public onWettkampfSelect($event: WettkampfDO[]): void {
    this.selectedWettkampfDTOs = [];
    this.selectedWettkampfDTOs = $event;
    if (!!this.selectedWettkampfDTOs && this.selectedWettkampfDTOs.length > 0) {
      this.selectedWettkampfId = this.selectedWettkampfDTOs[0].id;
    }
    //TODO enable buttons mit Verweis auf WettkampfID und VeranstaltungsID
    }

  public onView($event: WettkampfDO[]): void {
    this.selectedWettkampfDTOs = [];
    this.selectedWettkampfDTOs = $event;
    if (!!this.selectedWettkampfDTOs && this.selectedWettkampfDTOs.length > 0) {
      this.selectedWettkampfId = this.selectedWettkampfDTOs[0].id;
    }
//TODO enable buttons mit Verweis auf WettkampfID und VeranstaltungsID
  }


// backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.veranstaltungsDataProvider.findAll()
      .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload;  this.loadingVeranstaltungen = false; })
      .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload; });
  }


  private loadTableRows() {
    this.loadingWettkampfe = true;
    this.wettkampfDataProvider.findAllByVeranstaltungId(this.selectedVeranstaltungId)
      .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleFindWettkampfSuccess(response))
      .catch((response: BogenligaResponse<WettkampfDO[]>) => this.handleFindWettkampfFailure(response));
  }



  private handleFindWettkampfFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.rowsWettkampf = [];
    this.loadingWettkampfe = false;
  }

  private handleFindWettkampfSuccess(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.rowsWettkampf = []; // reset array to ensure change detection
    let i: number;
    this.remainingWettkampfRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingWettkampfe = false;
    }
    for (const wettkampf of response.payload) {
      const tableContentRow: WettkampfDO = new WettkampfDO();
      tableContentRow.wettkampfOrt = wettkampf.wettkampfOrt;
      tableContentRow.wettkampfBeginn = wettkampf.wettkampfBeginn;
      tableContentRow.wettkampfTag = wettkampf.wettkampfTag;
      tableContentRow.datum = wettkampf.datum;
      tableContentRow.id = wettkampf.id;
      tableContentRow.veranstaltungsId = wettkampf.veranstaltungsId;
      tableContentRow.version = wettkampf.version;

      this.tableContent.push(tableContentRow);
    }
    this.rowsWettkampf = toTableRows(this.tableContent);
    this.loadingWettkampfe = false;

  }


}
