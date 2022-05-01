import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {
  MATCH_TABLE_CONFIG,
  WKDURCHFUEHRUNG_CONFIG,
  WETTKAMPF_TABLE_CONFIG
} from './wkdurchfuehrung.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {
  VeranstaltungDataProviderService
} from '@verwaltung/services/veranstaltung-data-provider.service';
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
import {MatchDTOExt} from '../../types/datatransfer/match-dto-ext.class';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {onMapService} from '@shared/functions/onMap-service';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {WettkampfComponent} from '@wettkampf/components';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {OnOfflineService} from '@shared/services';
import {
  WettkampfOfflineSyncService
} from '@wkdurchfuehrung/services/wettkampf-offline-sync-service';


@Component({
  selector: 'bla-wkdurchfuehrung',
  templateUrl: './wkdurchfuehrung.component.html',
  styleUrls: ['./wkdurchfuehrung.component.scss']
})
export class WkdurchfuehrungComponent extends CommonComponentDirective implements OnInit {


  public config = WKDURCHFUEHRUNG_CONFIG;
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
  public availableYears: SportjahrVeranstaltungDO[];
  public selItemId: number;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private passeDataProviderService: PasseDataProviderService,
              private matchProvider: MatchProviderService,
              private onOfflineService: OnOfflineService,
              private wettkampfOfflineSyncService: WettkampfOfflineSyncService) {
    super();
  }

  ngOnInit() {

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
        this.findAvailableYears();

        this.LoadWettkampf();

        this.visible = false;

      } else if (this.onOfflineService.isOffline()) {
        //falls offline, Veranstaltung aus id die im onOfflineService gespeichert ist laden
        this.loadingWettkampfe = true;
        this.wettkampfIdEnthalten = true;
        this.wettkampfId = this.onOfflineService.getOfflineWettkampfID();
        console.log('WettkampfID:', this.wettkampfId);

        this.findAvailableYears();

        this.LoadWettkampf();

        this.visible = false;

      } else {
        // Pfad ohne WettkampfId
        // -> normaler Aufruf der Webseite (ohne Zusaetze)
        // loadVeranstaltungen: damit die Tabelle Veranstaltungen angezeigt wird
        this.wettkampfIdEnthalten = false;
        // Lade zuerst die anzuzeigenden Jahre
        this.findAvailableYears();

        this.visible = false;
      }
    });

  }

  public isOffline(): boolean {
    return this.onOfflineService.isOffline()
  }

  public onButtonGoOfflineClick(): void {
    if (this.onOfflineService.isOffline()) {
      this.onOfflineService.goOnline();
    } else {
      console.log('Going offline for Veranstaltung ' + this.selectedVeranstaltungId);
      this.wettkampfOfflineSyncService.loadLigatabelleVeranstaltungOffline(this.selectedVeranstaltungId);
      // TODO: Enable if the sync service endpoint is ready
      console.warn('LoadMatchOffline is not working because of server!\n Enable it when the endpoint is ready!');

      // sonarlint ignore comments
      // this.wettkampfOfflineSyncService.loadMatchOffline(this.selectedWettkampfId);
      // this.wettkampfOfflineSyncService.loadPasseOffline(/* ID FOR SEARCH IDK */);
      // this.wettkampfOfflineSyncService.loadWettkampfOffline( /* ID FOR SEARCH IDK */);
      // this.wettkampfOfflineSyncService.loadMannschaftOffline( /* ID FOR SEARCH IDK */);
      // this.wettkampfOfflineSyncService.loadMannschaftsmitgliedOffline(/* ID FOR SEARCH IDK */);
      // this.wettkampfOfflineSyncService.loadDsbMitgliedOffline(/* ID FOR SEARCH IDK */);
      // this.wettkampfOfflineSyncService.loadVeranstaltungOffline(/* ID FOR SEARCH IDK */);

      this.onOfflineService.goOffline(this.selectedWettkampfId, this.selItemId);

    }
  }


  // WettkampfId im Pfad enthalten -> Ermittlung des WettkampfDO:

  // Ermitteln aller Wettkampftage
  private LoadWettkampf() {
    this.loadingWettkampfe = true;
    this.wettkampfDataProvider.findAll()
    .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfSuccess(response))
    .catch((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfFailure(response));
  }

  // Wettkampftage konnten nicht ermittelt werden -> Fehlermeldung in der Konsole
  private handleLoadWettkampfFailure(): void {
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

    if (this.wettkampfId === Wettkampf.id) {
      // entsprechendes WettkampfDO wurde gefunden -> an this.wettkampf uebergeben
      this.wettkampf = Wettkampf;

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
    .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.loadVeranstaltungenSuccess(response);
    })
    .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.loadVeranstaltungenFailure(response);
    });
  }

  // backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findAll()
    .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.loadVeranstaltungenSuccess(response);
    })
    .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.loadVeranstaltungenFailure(response);
    });
  }

  // Ermittlung der Veranstaltungen war erfolgreich
  private loadVeranstaltungenSuccess(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.veranstaltungen = response.payload;
    this.loadingVeranstaltungen = false;

    // wenn eine WettkampfId Ã¼bergeben wurde, soll die Veranstaltung des Wettkampfs ermittelt werden
    if (this.wettkampfIdEnthalten) {
      this.veranstaltungen.forEach((veranstaltung) => this.findVeranstaltung(veranstaltung));
    }
  }

  // Ermittlung der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.veranstaltungen = response.payload;
  }


  // Ermittlung der Veranstaltung des Wettkampfs
  private findVeranstaltung(veranstaltung: VeranstaltungDO) {

    if (this.wettkampf.wettkampfVeranstaltungsId === veranstaltung.id) {
      // Veranstaltung von WettkampfDO wurde gefunden -> Ãœbergabe an this.veranstaltung
      this.veranstaltung = veranstaltung;

      // fuer Ausgabe unter der Veranstaltung Tabelle muss this.currentVeranstaltungName gesetzt werden:
      // dieses besteht aus dem Namen und dem Sportjahr der Veranstaltung
      this.currentVeranstaltungName = this.veranstaltung.name + ' ' + this.veranstaltung.sportjahr;

      let year: SportjahrVeranstaltungDO;
      // Suche nach dem passendem jahr und setze this.selItemId entsprechend.
      for (const sportjahr of this.availableYears) {
        if (sportjahr.sportjahr == this.veranstaltung.sportjahr) {
          this.selItemId = sportjahr.id;
          year = sportjahr;
        }
      }

      let verDOs: VeranstaltungDO[];
      verDOs = [this.veranstaltung];

      // Auswahl des passenden Jahres
      this.onSelectYear(year);

      // Auswahl der richtigen Veranstaltung
      this.onSelect(verDOs);

      // Auswahl des entsprechenden Wettkampfs in der Tabelle "Wettkampftage der Veranstaltung"
      // -> automatische Auswahl des Wettkampfs
      this.onView(this.wettkampf);

    }
  }

  // Ermittelt die entsprechenden Veranstaltungen wenn ein Jahr aus dem Drop-Down Menü ausgewählt wird.
  public onSelectYear($event: SportjahrVeranstaltungDO): void {
    this.veranstaltungsDataProvider.findBySportyear($event.sportjahr)
    .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.veranstaltungen = response.payload;
      this.loadingVeranstaltungen = false;
    })
    .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {
      this.loadVeranstaltungenYearsFailure(response);
    });

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
    .then((response: BogenligaResponse<VeranstaltungDTO>) => {
      this.currentVeranstaltungName = response.payload.name
        + ' ' + response.payload.sportjahr;
    })
    .catch(() => {
      this.currentVeranstaltungName = '';
    });
    this.rows = [];
    this.tableContent = [];
    if (this.selectedVeranstaltungId != null) {
      this.loadTableRows();
    }
  }

  // when a Ligatabelle gets selected from the list --> ID for Buttons

  public onView($event: VersionedDataObject): void {
    if ($event.id >= 0) {
      this.selectedWettkampfId = $event.id;
      this.selectedWettkampf = $event.id.toString();
      const wettkampfDO = $event as WettkampfDO;
      // is used to get the title for the currently selected Wettkampf @wettkampf.component.html
      document.getElementById('WettkampfTitle').innerText = this.currentVeranstaltungName +
        ' - ' + wettkampfDO.wettkampfTag + '. Wettkampftag';

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
          .then((response1: BogenligaResponse<MatchDTOExt[]>) => {
            // wenn es keine Matches gibt
            this.disabledButton = response1.payload.length === 0; // Falls erstes Match angefragt wird
          }).catch((reason) => {
            console.error('Error at findAllWettkampfMatchesAndNamesByID: ' + reason);
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
  public onMap($event: VersionedDataObject): void {
    const wettkampfDO = $event as WettkampfDO;
    onMapService(wettkampfDO);
  }

  // when a Wettkampf gets selected from the list --> ID for Buttons

  public onButtonTabletClick(): void {
    this.router.navigateByUrl('/wkdurchfuehrung/tabletadmin/' + this.selectedWettkampf);

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

  // macht buttons unklickbar wenn die Anwendung offline ist
  public isOfflineDisabled(): boolean {
    if (this.onOfflineService.isOffline()) {
      this.setOfflineVeranstaltung()
    }
    return this.onOfflineService.isOffline();
  }

  private setOfflineVeranstaltung(): void {
    this.selItemId = this.onOfflineService.getOfflineJahr();
    this.selectedVeranstaltungId = this.onOfflineService.getOfflineWettkampfID();
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
    .then(() => {
      this.showMatches();
    })
    // handleFailure -> Fehlermeldung muss aufgerufen werden
    .catch(() => {
      this.handleFailureGenerateMatches();
      this.showMatches();
    });
  }

  private handleFailureGenerateMatches(): void {
    this.notificationService.showNotification({
      id: 'NOTIFICATION_GENERIERE_MATCHES',
      title: 'WKDURCHFUEHRUNG.GENERIERE_MATCHES.NOTIFICATION.TITLE',
      description: 'WKDURCHFUEHRUNG.GENERIERE_MATCHES.NOTIFICATION.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.ACCEPTED
    });
  }

  // wenn "Edit" an einem Match geklickt wird
  // Ã¶ffnen wir in einem neuen Tab die Datenerfassung /Schusszettel fÃ¼r die Begegnung

  public onEdit($event: VersionedDataObject): void {
    const matchDoExt = $event as MatchDOExt;
    if ($event.id >= 0) {
      this.selectedMatchId = matchDoExt.id;
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
          this.router.navigate(['/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
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


  private handleFindWettkampfFailure(): void {
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


  private handleFindMatchFailure(): void {
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
      this.loadVeranstaltungenYearsSuccess(response);
    })
    .catch((response: BogenligaResponse<SportjahrVeranstaltungDO[]>) => {
      this.loadVeranstaltungenYearsFailure(response);
    });
  }

  // Ermittlung der Jahre der Veranstaltungen war erfolgreich und fülle availableYears
  private loadVeranstaltungenYearsSuccess(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {

    this.loadingYears = false;
    let counter = 1;
    if (response.payload !== []) {
      for (const elem of response.payload) {
        const t = new SportjahrVeranstaltungDO();
        t.sportjahr = elem.sportjahr.valueOf();
        t.version = 1;
        this.availableYears.push(t);
      }
      this.availableYears.sort((a, b) => {
        if (a.sportjahr.valueOf() < b.sportjahr.valueOf()) {
          return 1;
        }
        if (a.sportjahr.valueOf() > b.sportjahr.valueOf()) {
          return -1;
        }
      });
      for (const sportjahr of this.availableYears) {
        sportjahr.id = counter;
        counter++;
      }
      if (!this.wettkampfIdEnthalten) {
        // Lade die Veranstaltungen des neusten Jahres wenn keine id übergeben wurde und setze die Id des vorausgewählten
        // Jahres auf die id des neusten Jahres
        this.selItemId = this.availableYears[0].id;
        this.loadVeranstaltungenByYear(this.availableYears[0].sportjahr.valueOf());
      }

    }
  }

  // Ermittlung der Jahre der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenYearsFailure(): void {
    this.loadingYears = false;

  }


}
