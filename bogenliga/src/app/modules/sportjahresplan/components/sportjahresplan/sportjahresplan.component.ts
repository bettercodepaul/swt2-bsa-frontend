import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponent, toTableRows} from '@shared/components';
import {MATCH_TABLE_CONFIG, SPORTJAHRESPLAN_CONFIG, WETTKAMPF_TABLE_CONFIG} from './sportjahresplan.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from '@vereine/services/wettkampf-data-provider.service';
import {MatchDataProviderService} from '@vereine/services/match-data-provider.service';
import {MatchProviderService} from '../../services/match-provider.service';

import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WettkampfDO} from '@vereine/types/wettkampf-do.class';
import {WettkampfDTO} from '@vereine/types/datatransfer/wettkampf-dto.class';
import {NotificationService} from '@shared/services/notification';
import {environment} from '@environment';
import {MatchDO} from '@vereine/types/match-do.class';
import {MatchDTO} from '@vereine/types/datatransfer/match-dto.class';



@Component({
  selector:    'bla-sportjahresplan',
  templateUrl: './sportjahresplan.component.html',
  styleUrls:   ['./sportjahresplan.component.scss']
})
export class SportjahresplanComponent extends CommonComponent implements OnInit {

  public config = SPORTJAHRESPLAN_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public config_table_match = MATCH_TABLE_CONFIG;
  public PLACEHOLDER_VAR = 'Veranstaltung auswählen...';


  public pdf = new Blob();


  private selectedVeranstaltungId: number;
  public selectedDTOs: VeranstaltungDO[];
  private selectedWettkampf: string;
  private selectedWettkampfId: number;

  private selectedMatchId: number;
  private navurl: string;
  public multipleSelections = true;
  public veranstaltungen: VeranstaltungDO[];
  public loadingVeranstaltungen = true;
  public loadingWettkampfe = false;
  public loadingMatch = false;
  public rows: TableRow[];
  public matchRows: TableRow[];
  private tableContent: Array<WettkampfDO> = [];
  private tableContentMatch: Array<MatchDO> = [];
  private remainingWettkampfRequests: number;
  private remainingMatchRequests: number;
  private urlString: string;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private matchProvider: MatchProviderService) {
    super();
  }

  ngOnInit() {
    this.loadVeranstaltungen();
    this.visible = false;
  }



  // when a Veranstaltung gets selected from the list
  // load LigaTabelle
  public onSelect($event: VeranstaltungDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedVeranstaltungId = this.selectedDTOs[0].id;
    }
    this.rows = [];
    this.tableContent = [];
    if (this.selectedVeranstaltungId != null) {
      this.loadTableRows();
      }
  }

  // when a Wettkampf gets selected from the list --> ID for Buttons

  public onView($event: WettkampfDO): void {
    if ($event.id >= 0) {
      this.selectedWettkampfId = $event.id;
      this.selectedWettkampf = $event.id.toString();
      this.visible = true;

      this.matchDataProvider.findAllWettkampfMatchesById(this.selectedWettkampfId)
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleFindMatchSuccess(response))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.handleFindMatchFailure(response));

    }
// TODO URL-Sprung bei TabletButtonClick
  }
  // when a Wewttkampf gets selected from the list --> ID for Buttons

  public onButtonTabletClick(): void {
    this.router.navigateByUrl('/tabletadmin/' + this.selectedWettkampf);

  }

  public onButtonDownload(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?wettkampfid=' + this.selectedWettkampf)
      .build();
  }


  // wenn ein Wettkampftag ausgewählt wurde - dann werden die Button enabled,
  // da die Wettkampf-ID als Parameter weiter gegeben wird.

  public isDisabled(): boolean {
    if (this.selectedWettkampf === '') {
      return true;
    } else {
      return false;
    }
  }

  // wenn "Edit" an einem Match geklickt wird
  // öffnen wir in einem neuen Tab die Datenerfassung /Schusszettel für die Begegnung

  public onEdit($event: MatchDO): void {
    if ($event.id >= 0) {
      this.selectedMatchId = $event.id;
      this.matchProvider.next(this.selectedMatchId)
        .then((data) => {
          if (data.payload.length === 2) {
// das wäre schöner - funktioniert leider aber noch nicht...
// öffne die Datenerfassung in einem neuen Tab
/*            this.urlString = new UriBuilder()
              .fromPath(environment.)
              .path('/#/schusszettel/'+ data.payload[0])
              .path('/' + data.payload[1])
              .build();
            window.open(this.urlString, '_blank')
*/
            this.router.navigate(['/' + data.payload[0] + '/' + data.payload[1]]);
           }
        });
    }
  }




// backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findAll()
      .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload;  this.loadingVeranstaltungen = false; })
      .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload; });
  }


  private loadTableRows() {
    this.loadingWettkampfe = true;
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.wettkampfDataProvider.findAllByVeranstaltungId(this.selectedVeranstaltungId)
      .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleFindWettkampfSuccess(response))
      .catch((response: BogenligaResponse<WettkampfDO[]>) => this.handleFindWettkampfFailure(response));
  }



  private handleFindWettkampfFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.rows = [];
    this.loadingWettkampfe = false;
  }

  private handleFindWettkampfSuccess(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
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
    this.rows = toTableRows(this.tableContent);
    this.loadingWettkampfe = false;

  }


  private handleFindMatchFailure(response: BogenligaResponse<MatchDTO[]>): void {
    this.matchRows = [];
    this.loadingMatch = false;
  }

  private handleFindMatchSuccess(response: BogenligaResponse<MatchDTO[]>): void {
    this.matchRows = []; // reset array to ensure change detection
    this.remainingMatchRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingMatch = false;
    }
    for (const match of response.payload) {
      const tableContentRow: MatchDO = new MatchDO();
      tableContentRow.id = match.id;
      tableContentRow.nr = match.nr;
      tableContentRow.begegnung = match.begegnung;
      tableContentRow.scheibenNummer = match.scheibenNummer;
      tableContentRow.mannschaftId = match.mannschaftId;
      tableContentRow.matchpunkte = match.matchpunkte;
      tableContentRow.satzpunkte = match.satzpunkte;

      this.tableContentMatch.push(tableContentRow);
    }
    this.matchRows = toTableRows(this.tableContentMatch);
    this.loadingMatch = false;

  }



}
