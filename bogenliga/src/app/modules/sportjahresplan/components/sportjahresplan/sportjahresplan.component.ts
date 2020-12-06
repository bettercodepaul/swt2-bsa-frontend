import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {MATCH_TABLE_CONFIG, SPORTJAHRESPLAN_CONFIG, WETTKAMPF_TABLE_CONFIG} from './sportjahresplan.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {MatchProviderService} from '../../services/match-provider.service';
import {isUndefined} from '@shared/functions';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {NotificationService} from '@shared/services/notification';
import {environment} from '@environment';
import {MatchDTOExt} from '@sportjahresplan/types/datatransfer/match-dto-ext.class';
import {MatchDOExt} from '@sportjahresplan/types/match-do-ext.class';


@Component({
  selector:    'bla-sportjahresplan',
  templateUrl: './sportjahresplan.component.html',
  styleUrls:   ['./sportjahresplan.component.scss']
})
export class SportjahresplanComponent extends CommonComponentDirective implements OnInit {


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
  private tableContentMatch: Array<MatchDOExt> = [];
  private remainingWettkampfRequests: number;
  private remainingMatchRequests: number;
  private urlString: string;
  private currentVeranstaltungName;
  private wettkampfId;
  wettkampfIdEnthalten: boolean;
  wettkampf: WettkampfDO;
  wettkaempfe: Array<WettkampfDO> = [new WettkampfDO()];
  veranstaltung: VeranstaltungDO;



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

    this.route.params.subscribe((params) => {

      if (!isUndefined(params['wettkampfId'])) {
        //WettkampfId im Pfad enthalten -> Wettkampf soll automatisch ausgewaehlt werden
        this.wettkampfIdEnthalten=true;
        this.wettkampfId = parseInt(params['wettkampfId']);
        console.log("WettkampfID:", this.wettkampfId);


        // Ermitteln des Wettkampfs: für automatische Auswahl
        // Ermitteln aller Veranstaltungen: für die Tabelle Veranstaltungen
        // Ermitteln der Veranstaltung des aktuellen Wettkampfs: für die Ausgabe unter der Tabelle "Veranstaltungen",
        // diese besteht aus folgendem Muster:
        // VeranstaltungName VeranstaltungSportjahr - WettkampfTag. Wettkampftag

        // zunaechst wird der Wettkampf ermittelt, danach werden alle Veranstaltungen und die jeweilige Veranstaltung des Wettkampfs ermittelt
        // die Funktionen dazu werden nach der erfolgreichen Ermittlung des Wettkampfs aufgerufen
        // im Anschluss wird der Wettkampf automatisch aufgerufen
        // im Falle einer nicht erfolgreichen Ermittlung werden nur alle Veranstaltungen ermittelt, damit diese in der Tabelle "Veranstaltung" angezeigt werden können
        this.LoadWettkampf();

        this.visible = false;

      }
      else{
        // Pfad ohne WettkampfId
        // -> normaler Aufruf der Webseite (ohne Zusaetze)
        // loadVeranstaltungen: damit die Tabelle Veranstaltungen angezeigt wird
        this.wettkampfIdEnthalten = false;
        this.loadVeranstaltungen();
        this.visible = false;
      }
    });

  }


  // WettkampfId im Pfad enthalten -> Ermittlung des WettkampfDO:

  //Ermitteln aller Wettkampftage
  private LoadWettkampf() {
    console.log("Bin in  loadWettkampf");
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfSuccess(response))
        .catch((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfFailure(response));
  }

  // Wettkampftage konnten nicht ermittelt werden -> Fehlermeldung in der Konsole
  private handleLoadWettkampfFailure(response: BogenligaResponse<WettkampfDO[]>): void {
    console.log("ERROR: Keine Wettkaempfe gefunden");
    // die Wettkampftage konnten nicht erfolgreich geladen werden -> Ermittlung der Veranstaltung wird auch nicht möglich sein
    // somit sollen nur die Veranstaltungen für die Tabelle ermittelt werden, die Veranstaltung kann ja gar nicht mehr erfolgreich ermittelt werden
    // -> this.wettkampfIdEnthalten auf false setzen, damit die Veranstaltungen wie sonst auch geladen werden können
    this.wettkampfIdEnthalten = false;
    this.loadVeranstaltungen();
  }

  // Wettkampftage konnten ermittelt werden -> Aufruf von this.findWettkampf damit entsprechendes WettkampfDO ermittelt werden kann
  private handleLoadWettkampfSuccess(response: BogenligaResponse<WettkampfDO[]>): void {
    console.log("Bin in handleLoadWettkampfSucccess");
    this.wettkaempfe = [];
    // Übergabe aller Wettkaempfe an this.wettkaempfe
    this.wettkaempfe = response.payload;
    this.wettkaempfe.forEach((Wettkampf: WettkampfDO) => this.findWettkampf(Wettkampf));
  }

  // Ermittle der wettkampfId entsprechendes WettkampfDO
  private findWettkampf(Wettkampf: WettkampfDO) {
    console.log("Bin in findWettkampf");

    if(this.wettkampfId== Wettkampf.id){
      // entsprechendes WettkampfDO wurde gefunden -> an this.wettkampf uebergeben
      this.wettkampf=Wettkampf;
      console.log("Wettkampf gefunden:", this.wettkampf);

      // als nächstes müssen alle Veranstaltungen für die Tabelle "Veranstaltung" und die aktuelle Veranstaltung für die Ausgabe darunter ermittelt werden
      this.loadVeranstaltungen();
    }
  }

  // backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenSuccess(response) })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenFailure(response) });
  }

  // Ermittlung der Veranstaltungen war erfolgreich
  private loadVeranstaltungenSuccess(response: BogenligaResponse<VeranstaltungDTO[]>): void{
    console.log("Bin in loadVeranstaltungenSuccess");
    this.veranstaltungen = response.payload;
    this.loadingVeranstaltungen = false;

    // wenn eine WettkampfId übergeben wurde, soll die Veranstaltung des Wettkampfs ermittelt werden
    if(this.wettkampfIdEnthalten){
      this.veranstaltungen.forEach((veranstaltung) => this.findVeranstaltung(veranstaltung));
    }
  }

  // Ermittlung der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void{
    console.log("Bin in loadVeranstaltungenFailure");
    this.veranstaltungen = response.payload;
  }


  // Ermittlung der Veranstaltung des Wettkampfs
  private findVeranstaltung(veranstaltung: VeranstaltungDO) {
    console.log("Bin in findVeranstaltung");

    if(this.wettkampf.wettkampfVeranstaltungsId== veranstaltung.id){
      // Veranstaltung von WettkampfDO wurde gefunden -> Übergabe an this.veranstaltung
      this.veranstaltung=veranstaltung;
      console.log("Veranstaltung gefunden:", this.veranstaltung);

      // fuer Ausgabe unter der Veranstaltung Tabelle muss this.currentVeranstaltungName gesetzt werden:
      // dieses besteht aus dem Namen und dem Sportjahr der Veranstaltung
      const veranstaltungNameMitJahr = this.veranstaltung.name+" "+this.veranstaltung.sportjahr;
      this.currentVeranstaltungName=veranstaltungNameMitJahr;

      // Auswahl des entsprechenden Wettkampfs in der Tabelle "Wettkampftage der Veranstaltung"
      // -> automatische Auswahl des Wettkampfs
      this.onView(this.wettkampf);
    }
  }


  // when a Veranstaltung gets selected from the list
  // load LigaTabelle
  public onSelect($event: VeranstaltungDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedVeranstaltungId = this.selectedDTOs[0].id;
    }
    // is used to get the name of the currentVeranstaltung is saved in @this.currentVeranstaltungName
    this.veranstaltungsDataProvider.findById(this.selectedVeranstaltungId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => {this.currentVeranstaltungName = response.payload.name
          + ' ' + response.payload.sportjahr; })
        .catch(() => {this.currentVeranstaltungName = ''; });
    this.rows = [];
    this.tableContent = [];
    if (this.selectedVeranstaltungId != null) {
      this.loadTableRows();
    }
  }

  // when a Ligatabelle gets selected from the list --> ID for Buttons

  public onView($event: WettkampfDO): void {
    console.log("DataOBJ",$event);
    if ($event.id >= 0) {
      this.selectedWettkampfId = $event.id;
      this.selectedWettkampf = $event.id.toString();

      // is used to get the title for the currently selected Wettkampf @wettkampf.component.html
      document.getElementById('WettkampfTitle').innerText = this.currentVeranstaltungName +
        ' - ' + $event.wettkampfTag + '. Wettkampftag';

      this.visible = true;

      this.tableContentMatch = [];

      this.matchProvider.findAllWettkampfMatchesAndNamesById(this.selectedWettkampfId)
          .then((response: BogenligaResponse<MatchDTOExt[]>) => this.handleFindMatchSuccess(response))
          .catch((response: BogenligaResponse<MatchDTOExt[]>) => this.handleFindMatchFailure(response));
    }
// TODO URL-Sprung bei TabletButtonClick
  }

  /** DUPLICATE
   * Creates Link to Google Maps
   * Splits given Location at every comma and passes it to Google Maps
   * @param $event
   */
  public onMap($event: WettkampfDO): void {

    const str = $event.wettkampfOrt;
    let splits: string[];
    splits = str.split(', ', 5);
    let locationUrl = 'https://www.google.de/maps/place/';
    for (let i = 0; i < splits.length; i++) {
      if (i !== 0) {
        locationUrl += '+';
      }
      locationUrl += splits[i];
    }
    window.open(locationUrl);
  }

  // when a Wettkampf gets selected from the list --> ID for Buttons

  public onButtonTabletClick(): void {
    this.router.navigateByUrl('/sportjahresplan/tabletadmin/' + this.selectedWettkampf);

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
  // da die Ligatabelle-ID als Parameter weiter gegeben wird.

  public isDisabled(): boolean {
    if (this.selectedWettkampf === '') {
      return true;
    } else {
      return false;
    }
  }

   // wenn "Edit" an einem Match geklickt wird
  // öffnen wir in einem neuen Tab die Datenerfassung /Schusszettel für die Begegnung

  public onEdit($event: MatchDOExt): void {
    if ($event.id >= 0) {
      this.selectedMatchId = $event.id;
      this.matchProvider.pair(this.selectedMatchId)
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
              this.router.navigate(['/sportjahresplan/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
            }
          });
    }
  }

  private loadTableRows() {
    this.loadingWettkampfe = true;
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.wettkampfDataProvider.findAllByVeranstaltungId(this.selectedVeranstaltungId)
        .then((response: BogenligaResponse<WettkampfDTO[]>) => this.handleFindWettkampfSuccess(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleFindWettkampfFailure(response));
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
      tableContentRow.wettkampfDatum = wettkampf.wettkampfDatum;
      tableContentRow.id = wettkampf.id;
      tableContentRow.wettkampfVeranstaltungsId = wettkampf.wettkampfVeranstaltungsId;
      tableContentRow.version = wettkampf.version;


      this.tableContent.push(tableContentRow);
    }
    this.rows = toTableRows(this.tableContent);
    this.loadingWettkampfe = false;

  }


  private handleFindMatchFailure(response: BogenligaResponse<MatchDTOExt[]>): void {
    this.matchRows = [];
    this.loadingMatch = false;
  }

  private handleFindMatchSuccess(response: BogenligaResponse<MatchDTOExt[]>): void {
    this.matchRows = []; // reset array to ensure change detection
    this.remainingMatchRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingMatch = false;
    }
    for (const match of response.payload) {
      const tableContentRow: MatchDOExt = new MatchDOExt();
      tableContentRow.id = match.id;
      tableContentRow.nr = match.nr;
      tableContentRow.begegnung = match.begegnung;
      tableContentRow.scheibenNummer = match.scheibenNummer;
      tableContentRow.mannschaftName = match.mannschaftName;
      tableContentRow.matchpunkte = match.matchpunkte;
      tableContentRow.satzpunkte = match.satzpunkte;
      tableContentRow.version = match.version;

      this.tableContentMatch.push(tableContentRow);
    }
    this.matchRows = toTableRows(this.tableContentMatch);
    this.loadingMatch = false;
  }
}
