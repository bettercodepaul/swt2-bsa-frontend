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
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services/notification';
import {environment} from '@environment';
import {MatchDTOExt} from '@sportjahresplan/types/datatransfer/match-dto-ext.class';
import {MatchDOExt} from '@sportjahresplan/types/match-do-ext.class';
import {onMapService} from '@shared/functions/onMap-service';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {WettkampfComponent} from '@wettkampf/components';
import {MatchDTO} from '@verwaltung/types/datatransfer/match-dto.class';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';



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
  private disabledButton = true;
  private disabledOtherButtons = true;
  wettkampfIdEnthalten: boolean;
  public wettkampfListe;
  wettkampf: WettkampfDO;
  wettkaempfe: Array<WettkampfDO> = [new WettkampfDO()];
  veranstaltung: VeranstaltungDO;
  public matches: Array<MatchDO[]> = [];
  private wettkampfComponent: WettkampfComponent;

  public loadingYears = true;
  public availableYears : SportjahrVeranstaltungDO[];
  private currentYear: number;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private passeDataProviderService: PasseDataProviderService,
              private matchProvider: MatchProviderService) {
    super();
  }

  ngOnInit() {

    this.currentYear = new Date().getFullYear().valueOf();

    this.findAvailableYears();

    this.route.params.subscribe((params) => {

      if (!isUndefined(params['wettkampfId'])) {
        // WettkampfId im Pfad enthalten -> Wettkampf soll automatisch ausgewaehlt werden
        this.wettkampfIdEnthalten = true;
        this.wettkampfId = parseInt(params['wettkampfId'], 10);
        console.log('WettkampfID:', this.wettkampfId);


        // Ermitteln des Wettkampfs: fÃ¼r automatische Auswahl
        // Ermitteln aller Veranstaltungen: fÃ¼r die Tabelle Veranstaltungen
        // Ermitteln der Veranstaltung des aktuellen Wettkampfs: fÃ¼r die Ausgabe unter der Tabelle "Veranstaltungen",
        // diese besteht aus folgendem Muster:
        // VeranstaltungName VeranstaltungSportjahr - WettkampfTag. Wettkampftag

        // zunaechst wird der Wettkampf ermittelt, danach werden alle Veranstaltungen und die jeweilige Veranstaltung des Wettkampfs ermittelt
        // die Funktionen dazu werden nach der erfolgreichen Ermittlung des Wettkampfs aufgerufen
        // im Anschluss wird der Wettkampf automatisch aufgerufen
        // im Falle einer nicht erfolgreichen Ermittlung werden nur alle Veranstaltungen ermittelt, damit diese in der Tabelle "Veranstaltung" angezeigt werden kÃ¶nnen
        this.LoadWettkampf();

        this.visible = false;

      } else {
        // Pfad ohne WettkampfId
        // -> normaler Aufruf der Webseite (ohne Zusaetze)
        // loadVeranstaltungen: damit die Tabelle Veranstaltungen angezeigt wird
        this.wettkampfIdEnthalten = false;
        // Lade zuerst das aktuelle Jahr
        this.loadVeranstaltungenByYear(this.currentYear.valueOf());
        this.visible = false;
      }
    });

  }





  // WettkampfId im Pfad enthalten -> Ermittlung des WettkampfDO:

  // Ermitteln aller Wettkampftage
  private LoadWettkampf() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfSuccess(response))
        .catch((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfFailure(response));
  }

  // Wettkampftage konnten nicht ermittelt werden -> Fehlermeldung in der Konsole
  private handleLoadWettkampfFailure(response: BogenligaResponse<WettkampfDO[]>): void {
    console.log('ERROR: Keine Wettkaempfe gefunden');
    // die Wettkampftage konnten nicht erfolgreich geladen werden -> Ermittlung der Veranstaltung wird auch nicht mÃ¶glich sein
    // somit sollen nur die Veranstaltungen fÃ¼r die Tabelle ermittelt werden, die Veranstaltung kann ja gar nicht mehr erfolgreich ermittelt werden
    // -> this.wettkampfIdEnthalten auf false setzen, damit die Veranstaltungen wie sonst auch geladen werden kÃ¶nnen
    this.wettkampfIdEnthalten = false;
    this.loadVeranstaltungen();
  }

  // Wettkampftage konnten ermittelt werden -> Aufruf von this.findWettkampf damit entsprechendes WettkampfDO ermittelt werden kann
  private handleLoadWettkampfSuccess(response: BogenligaResponse<WettkampfDO[]>): void {
    this.wettkaempfe = [];
    // Ãœbergabe aller Wettkaempfe an this.wettkaempfe
    this.wettkaempfe = response.payload;
    this.wettkaempfe.forEach((Wettkampf: WettkampfDO) => this.findWettkampf(Wettkampf));
  }

  // Ermittle der wettkampfId entsprechendes WettkampfDO
  private findWettkampf(Wettkampf: WettkampfDO) {
    console.log('Bin in findWettkampf');

    if (this.wettkampfId === Wettkampf.id) {
      // entsprechendes WettkampfDO wurde gefunden -> an this.wettkampf uebergeben
      this.wettkampf = Wettkampf;
      console.log('Wettkampf gefunden:', this.wettkampf);

      // als nÃ¤chstes mÃ¼ssen alle Veranstaltungen fÃ¼r die Tabelle "Veranstaltung" und die aktuelle Veranstaltung fÃ¼r die Ausgabe darunter ermittelt werden
      this.loadVeranstaltungen();
    }
  }

// backend-call um eine Liste der Veranstaltungen eines bestimmten Jahres zu ermitteln
  private loadVeranstaltungenByYear(year: number): void {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findBySportyear(year)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenSuccess(response); })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenFailure(response); });
  }

  // backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenSuccess(response); })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenFailure(response); });
  }

  // Ermittlung der Veranstaltungen war erfolgreich
  private loadVeranstaltungenSuccess(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    console.log('Bin in loadVeranstaltungenSuccess');
    this.veranstaltungen = response.payload;
    this.loadingVeranstaltungen = false;

    // wenn eine WettkampfId Ã¼bergeben wurde, soll die Veranstaltung des Wettkampfs ermittelt werden
    if (this.wettkampfIdEnthalten) {
      this.veranstaltungen.forEach((veranstaltung) => this.findVeranstaltung(veranstaltung));
    }
  }

  // Ermittlung der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    console.log('Bin in loadVeranstaltungenFailure');
    this.veranstaltungen = response.payload;
  }


  // Ermittlung der Veranstaltung des Wettkampfs
  private findVeranstaltung(veranstaltung: VeranstaltungDO) {
    console.log('Bin in findVeranstaltung');

    if (this.wettkampf.wettkampfVeranstaltungsId === veranstaltung.id) {
      // Veranstaltung von WettkampfDO wurde gefunden -> Ãœbergabe an this.veranstaltung
      this.veranstaltung = veranstaltung;
      console.log('Veranstaltung gefunden:', this.veranstaltung);

      // fuer Ausgabe unter der Veranstaltung Tabelle muss this.currentVeranstaltungName gesetzt werden:
      // dieses besteht aus dem Namen und dem Sportjahr der Veranstaltung
      this.currentVeranstaltungName = this.veranstaltung.name + ' ' + this.veranstaltung.sportjahr;

      // Auswahl des entsprechenden Wettkampfs in der Tabelle "Wettkampftage der Veranstaltung"
      // -> automatische Auswahl des Wettkampfs
      this.onView(this.wettkampf);
    }
  }

  public onSelectYear($event: SportjahrVeranstaltungDO): void {
    this.veranstaltungsDataProvider.findBySportyear($event.sportjahr)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenSuccess(response); })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.loadVeranstaltungenFailure(response); });
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
    console.log('DataOBJ', $event);
    if ($event.id >= 0) {
      this.selectedWettkampfId = $event.id;
      this.selectedWettkampf = $event.id.toString();

      // is used to get the title for the currently selected Wettkampf @wettkampf.component.html
      document.getElementById('WettkampfTitle').innerText = this.currentVeranstaltungName +
        ' - ' + $event.wettkampfTag + '. Wettkampftag';

      this.visible = true;
      this.tableContentMatch = [];
      this.showMatches();

    }
// TODO URL-Sprung bei TabletButtonClick
  }
  // Zeigt Matches an
  public showMatches() {
    this.matchProvider.findAllWettkampfMatchesAndNamesById(this.selectedWettkampfId)
        .then((response: BogenligaResponse<MatchDTOExt[]>) => {
        // Prüfe ob Matches schon existieren
          if (response.payload.length !== 0) {
            this.matchesExist();
          } else {
            this.matchesNotExist();
            // prüfe ob es sich um den ersten wettkampftag handelt
            if (this.selectedWettkampfId - 1 < this.wettkampfListe[0].id) {
              // aktiviere Button
              this.disabledButton = false;
            } else {
              // abfrage für vorherigen Matchtag
              this.matchProvider.findAllWettkampfMatchesAndNamesById(this.selectedWettkampfId - 1)
                  .then((response: BogenligaResponse<MatchDTOExt[]>) => {
                    // wenn es keine Matches gibt
                    if ( response.payload.length === 0 ) {
                      // dekatviere  Button
                      this.disabledButton = true;
                    } else {
                      // aktivere button generiere Mathces
                      this.disabledButton = false;
                    }// Falls erstes Match angefragt wird
                  }).catch((response: BogenligaResponse<MatchDTOExt[]>) => {
              });
            }
          }
          this.handleFindMatchSuccess(response);
        })
        .catch((response: BogenligaResponse<MatchDTOExt[]>) => this.handleFindMatchFailure(response));
  }



  /**
   * Creates Link to Google Maps
   * Splits given Location at every comma and passes it to Google Maps
   * @param $event
   */
  public onMap($event: WettkampfDO): void {
    onMapService($event);
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

  // wenn ein Wettkampftag ausgewÃ¤hlt wurde - dann werden die Button enabled,
  // da die Ligatabelle-ID als Parameter weiter gegeben wird.

  public isDisabled(): boolean {
  return this.disabledOtherButtons;
  }


  // Funktion falls Matches existieren -> alle Buttons gehen an, generiere Matches aus
  private matchesExist() {
    this.disabledOtherButtons = false;
    this.disabledButton = true;
  }
  // Funktion wenn Matches nicht existieren -> generiere Matches Button geht aus, alle weiteren an
  private matchesNotExist() {
    this.disabledOtherButtons = true;
    this.disabledButton = false;
  }

  public isDisabledGMButton(): boolean {
    return this.disabledButton;
}

  public generateMatches() {
    this.matchDataProvider.generateDataForMatches(this.selectedWettkampfId)
        .then((response: BogenligaResponse<MatchDTO[]>) => {
          console.log('Response von generateMatches(): ', response);
          this.showMatches();
        })
        // handleFailure -> Fehlermeldung muss aufgerufen werden
        .catch((response: BogenligaResponse<MatchDTO[]>) =>  {
          this.handleFailureGenerateMatches();
          this.showMatches();
        });
  }

  private handleFailureGenerateMatches(): void {
    this.notificationService.showNotification({
      id:          'NOTIFICATION_GENERIERE_MATCHES',
      title:       'SPORTJAHRESPLAN.GENERIERE_MATCHES.NOTIFICATION.TITLE',
      description: 'SPORTJAHRESPLAN.GENERIERE_MATCHES.NOTIFICATION.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.ACCEPTED
  });
  }

  // wenn "Edit" an einem Match geklickt wird
  // Ã¶ffnen wir in einem neuen Tab die Datenerfassung /Schusszettel fÃ¼r die Begegnung

  public onEdit($event: MatchDOExt): void {
    if ($event.id >= 0) {
      this.selectedMatchId = $event.id;
      this.matchProvider.pair(this.selectedMatchId)
          .then((data) => {
            if (data.payload.length === 2) {
// das wÃ¤re schÃ¶ner - funktioniert leider aber noch nicht...
// Ã¶ffne die Datenerfassung in einem neuen Tab
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
        .then((response: BogenligaResponse<WettkampfDTO[]>) => {
          // Um rauszufinden ob es sich um ersten Wettkampftag handelt
          this.wettkampfListe = response.payload;
          this.handleFindWettkampfSuccess(response);
        })
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
      tableContentRow.wettkampfStrasse = wettkampf.wettkampfStrasse;
      tableContentRow.wettkampfPlz = wettkampf.wettkampfPlz;
      tableContentRow.wettkampfOrtsname = wettkampf.wettkampfOrtsname;
      tableContentRow.wettkampfOrtsinfo = wettkampf.wettkampfOrtsinfo;
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

  // Ermittlung der anzuzeigenden Jahre
  private findAvailableYears() {
    this.availableYears = [];
    this.veranstaltungsDataProvider.findAllSportyearDestinct()
        .then((response: BogenligaResponse<SportjahrVeranstaltungDO[]>) => {
          this.loadVeranstaltungenYearsSuccess(response); })
        .catch((response: BogenligaResponse<SportjahrVeranstaltungDO[]>) => {this.loadVeranstaltungenYearsFailure(response); });
  }

  // Ermittlung der Jahre der Veranstaltungen war erfolgreich und fülle availableYears
  private loadVeranstaltungenYearsSuccess(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {
    this.loadingYears = false;
    let oldest =this.currentYear;
    let counter = 1;
    if(response.payload != []){
    for(let elem of response.payload){
      if (elem.sportjahr.valueOf() <= oldest){
        oldest = elem.sportjahr.valueOf();
      }}}

    console.log("oldest Year: "+oldest);
    for (let i = this.currentYear;i>=oldest;i--){
      let t = new SportjahrVeranstaltungDO()
      t.sportjahr = i;
      t.id = counter;
      t.version = 1;
      counter++;
      this.availableYears.push(t);
    }
    console.log('Bin in loadVeranstaltungenYearSuccess!');
  }

  // Ermittlung der Jahre der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenYearsFailure(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {
    this.loadingYears = false;
    console.log('Bin in loadVeranstaltungenYearFailure');

  }
}
