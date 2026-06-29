import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {MATCH_TABLE_CONFIG, WETTKAMPF_TABLE_CONFIG, WKDURCHFUEHRUNG_CONFIG} from './wkdurchfuehrung.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
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
import {MatchDTOExt} from '../../types/datatransfer/match-dto-ext.class';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {onMapService} from '@shared/functions/onMap-service';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {WettkampfOfflineSyncService} from '@wkdurchfuehrung/services/wettkampf-offline-sync-service';
import {db} from '@shared/data-provider/offlinedb/offlinedb';

import {MatDialog} from '@angular/material/dialog';
import {
  DsbMitgliedDetailPopUpComponent
} from '@verwaltung/components/dsb-mitglied/dsb-mitglied-detail-pop-up/dsb-mitglied-detail-pop-up.component';
import {getActiveSportYear} from '@shared/functions/active-sportyear';
import {SessionHandling} from '@shared/event-handling';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {KampfrichterAnsichtService} from '@schusszettel/services/kampfrichter-ansicht.service';

@Component({
  selector: 'bla-wkdurchfuehrung',
  templateUrl: './wkdurchfuehrung.component.html',
  styleUrls: ['./wkdurchfuehrung.component.scss']
})

export class WkdurchfuehrungComponent extends CommonComponentDirective implements OnInit, OnDestroy {

  public div1Visible = false;
  public div2Visible = true;
  public ActionButtonColors = ActionButtonColors;
  public config = WKDURCHFUEHRUNG_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public config_table_match = MATCH_TABLE_CONFIG;
  public PLACEHOLDER_VAR = 'Veranstaltung auswählen...';
  public pdf = new Blob();
  public selectedVeranstaltungId: number;
  public selectedDTOs: VeranstaltungDO[];
  private selectedWettkampf: string;
  public selectedWettkampfId: number;
  private selectedWettkampfListeIndex: number;
  private selectedMatchId: number;
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
  public currentVeranstaltungName;
  private veranstaltungId;
  private wettkampfId;
  private disableGMButton = true;
  private disabledOtherButtons = true;
  wettkampfIdEnthalten: boolean;
  public wettkampfListe;
  private aktivesSportjahr: number;
  wettkampf: WettkampfDO;
  wettkaempfe: Array<WettkampfDO> = [new WettkampfDO()];
  veranstaltung: VeranstaltungDO;
  public matches: Array<MatchDO[]> = [];
  public selectedWettkampftag: any;
  public selectedWettkampftagURL: number;


  public loadingYears = true;
  public availableYears: SportjahrVeranstaltungDO[];
  public selItemId: number;




  private sessionHandling: SessionHandling;

  public kampfrichterQrUrl: string | null = null;
  public kampfrichterQrLoading = false;

  // Live-Aktualisierung der Match-Tabelle: Passen werden nach jeder gespeicherten
  // Passe vom Tablet in die DB geschrieben und hier periodisch nachgeladen
  public readonly liveIntervallSekunden = 15;
  public liveAktualisiert: Date = null;
  private liveRefreshSubscription: Subscription = null;
  private liveRefreshLaeuft = false;
  private passen: PasseDoClass[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private einstellungenDataProvider: EinstellungenProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private passeDataProviderService: PasseDataProviderService,
              private matchProvider: MatchProviderService,
              private onOfflineService: OnOfflineService,
              private currentUserService: CurrentUserService,
              private wettkampfOfflineSyncService: WettkampfOfflineSyncService,
              private dialog: MatDialog,
              private kampfrichterAnsichtService: KampfrichterAnsichtService

  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }



  // Definiert das Array groupedMatches mit der Struktur { groupName: string; matches: TableRow[] }
  groupedMatches: { groupName: string; matches: TableRow[] }[] = [];

  goBack(): void {
    window.history.back();
  }

  openSecondView() {
    // statt einfach nur einen Teil ein/auszublenden - rufen wir hier jetzt den ganzen Dialog nochmal auf
    // wir setzen beim Aufruf in den Pfad die Wettkampf-ID ein - damit kann man später vom Schusszettel auf die Matchliste zurückspringen

    const url = '#' + this.router.serializeUrl(
      this.router.createUrlTree(
        [new UriBuilder().path('wkdurchfuehrung/' + this.selectedVeranstaltungId + '/' + this.selectedWettkampf).build() ]
      )
    );
    window.open(url, '_blank');
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {

      if (!isUndefined(params['wettkampfId'])) {
        // WettkampfId im Pfad enthalten -> Wettkampf soll automatisch ausgewaehlt werden


        this.wettkampfIdEnthalten = true;
        this.veranstaltungId = parseInt(params['veranstaltungId'], 10);
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



        this.selectedVeranstaltungId = this.veranstaltungId;
        this.selectedWettkampfId = this.wettkampfId;
        this.showMatches();
        this.visible = true;
        // Setzt die Sichtbarkeit der divs und simuliert damit eine neue Seite
        this.div1Visible = true; // ausblenden
        this.div2Visible = false; // sichtbar

      } else if (this.onOfflineService.isOffline()) {
        // falls offline, Veranstaltung aus id die im onOfflineService gespeichert ist laden
        this.loadingWettkampfe = true;
        this.wettkampfIdEnthalten = true;
        this.wettkampfId = this.onOfflineService.getOfflineWettkampfID();
        console.log('WettkampfID used for loading offlinepage Wkdurchfuehrung:', this.wettkampfId);


        this.findAvailableYears();
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
  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver() {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }
  public isOffline(): boolean {
    return this.onOfflineService.isOffline();
  }
  public isAdmin(): boolean {
    return this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN);
  }
  public async resetWettkampfToken(id: number): Promise<void> {

    try {
      await this.wettkampfOfflineSyncService.resetWettkampfToken(id);
      this.notificationService.showNotification({
        id: 'Offlinetoken gelöscht',
        description: 'Der Offlinetoken wurde erfolgreich gelöscht und somit der Wettkampf entsperrt.',
        title: 'Offlinetoken gelöscht',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.ACCEPTED,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO
      });

    } catch (e) {

      this.notificationService.showNotification({
        id: 'Offlinetoken gelöscht Fehler',
        description: 'Ein fehler ist aufgetreten und der Offlinetoken wurde nicht gelöscht.',
        title: 'Fehler beim Löschen des Offlinetokens',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.ACCEPTED,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO
      });

    }
  }
  public async onButtonGoOfflineClick(): Promise<void> {
    if (this.onOfflineService.isOffline()) {

      try {
        await this.wettkampfOfflineSyncService.goOnlineSync(this.onOfflineService.getOfflineWettkampfID());

        this.onOfflineService.goOnline();
        this.disabledOtherButtons = true;


        this.notificationService.showNotification({
          id: 'GO_ONLINE_ERROR',
          description: 'WKDURCHFUEHRUNG.ONLINE.NOTIFICATION.SUCCESS.DESCRIPTION',
          title: 'WKDURCHFUEHRUNG.ONLINE.NOTIFICATION.SUCCESS.TITLE',
          origin: NotificationOrigin.SYSTEM,
          userAction: NotificationUserAction.ACCEPTED,
          type: NotificationType.OK,
          severity: NotificationSeverity.INFO
        });


      } catch (e) {
        console.error(e);
        this.notificationService.discardNotification();

        this.notificationService.showNotification({
          id: 'GO_ONLINE_ERROR',
          description: 'WKDURCHFUEHRUNG.ONLINE.NOTIFICATION.FAILURE.DESCRIPTION',
          title: 'WKDURCHFUEHRUNG.ONLINE.NOTIFICATION.FAILURE.TITLE',
          origin: NotificationOrigin.SYSTEM,
          userAction: NotificationUserAction.ACCEPTED,
          type: NotificationType.OK,
          severity: NotificationSeverity.ERROR
        });
      }

    } else {
      console.log('Going offline for Veranstaltung ' + this.selectedVeranstaltungId);
      // Die db wird erst gelöscht und dann wieder erzeugt damit die Datenbank leer ist und keine Doppelten einträge entstehen
      db.delete().then(() => {
        db.open().then(async () => {
          console.log('Database opened');
          try {
            // Wait for all the load functions to finish


            await this.wettkampfOfflineSyncService.loadLigatabelleVeranstaltungOffline(this.selectedVeranstaltungId);
            if (this.wettkampfListe && this.wettkampfListe.length > 0) {
              for (const wk of this.wettkampfListe) {
                await this.wettkampfOfflineSyncService.loadMannschaftsmitgliedOffline(wk.id);
                await this.wettkampfOfflineSyncService.loadPasseOffline(wk.id);
                await this.wettkampfOfflineSyncService.loadMatchOffline(wk.id);
                await this.wettkampfOfflineSyncService.loadWettkampfOffline(wk.id);
              }
            } else {
              await this.wettkampfOfflineSyncService.loadMannschaftsmitgliedOffline(this.selectedWettkampfId);
              await this.wettkampfOfflineSyncService.loadPasseOffline(this.selectedWettkampfId);
              await this.wettkampfOfflineSyncService.loadMatchOffline(this.selectedWettkampfId);
              await this.wettkampfOfflineSyncService.loadWettkampfOffline(this.selectedWettkampfId);
            }
            await this.wettkampfOfflineSyncService.loadVeranstaltungOffline(this.selectedVeranstaltungId);
            await this.wettkampfOfflineSyncService.loadDsbMitgliedOffline();
            await this.wettkampfOfflineSyncService.loadVereineOffline();
            await this.wettkampfOfflineSyncService.loadManschaftenOffline();


            this.onOfflineService.goOffline(this.selectedWettkampfId, this.selectedDTOs[0].sportjahr);

            // lädt Inhalte der Tabelle neu mit Offlinedaten
            this.loadingVeranstaltungen = true;
            this.wettkampfIdEnthalten = true;
            this.wettkampfId = this.onOfflineService.getOfflineWettkampfID();

            // temporäre Dummy Daten
            // await this.wettkampfOfflineSyncService.createWettkampfDummyData();

            await this.LoadWettkampf();
            this.visible = false;


            this.notificationService.showNotification({
              id: 'OFFLINE_MODE_ON',
              description: 'WKDURCHFUEHRUNG.OFFLINE.NOTIFICATION.SUCCESS.DESCRIPTION',
              title: 'WKDURCHFUEHRUNG.OFFLINE.NOTIFICATION.SUCCESS.TITLE',
              origin: NotificationOrigin.SYSTEM,
              userAction: NotificationUserAction.ACCEPTED,
              type: NotificationType.OK,
              severity: NotificationSeverity.INFO

            });
            // Hier sollte statt einem refresh irgendwann das sidebarcomponent neu geladen werden
          } catch (error) {

            console.error('Error while loading offline data');
            this.notificationService.showNotification({
              id: 'OFFLINE_MODE_OFF',
              description: 'WKDURCHFUEHRUNG.OFFLINE.NOTIFICATION.FAILURE.DESCRIPTION',
              title: 'WKDURCHFUEHRUNG.OFFLINE.NOTIFICATION.FAILURE.TITLE',
              origin: NotificationOrigin.SYSTEM,
              userAction: NotificationUserAction.PENDING,
              type: NotificationType.OK,
              severity: NotificationSeverity.ERROR,
            });
          }
          // Erst wenn die Db wieder geöffnet wurde, werden die Daten geladen.


          // geplant für die zukunft:
          // this.wettkampfOfflineSyncService.loadWettkampfOffline( this.selectedWettkampfId);
          // this.wettkampfOfflineSyncService.loadDsbMitgliedOffline(/* ID FOR SEARCH IDK */);
          // MANNSCHAFT WIRD ZUM JETZTIGEN STAND NICHT MEHR BENÖTIGT.
          // Der Aufruf bleibt aber erhalten falls es in der Zukunft benötigt wird.
          // this.wettkampfOfflineSyncService.loadMannschaftOffline( /* ID FOR SEARCH IDK */);
        });
      });


    }
  }
  // WettkampfId im Pfad enthalten -> Ermittlung des WettkampfDO:
  // Ermitteln aller Wettkampftage
  private async LoadWettkampf() {
    this.loadingWettkampfe = true;
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkampfSuccess(response))
        .catch(() => this.handleLoadWettkampfFailure());
  }
  // Wettkampftage konnten nicht ermittelt werden -> Fehlermeldung in der Konsole
  private handleLoadWettkampfFailure(): void {
    console.log('ERROR: Keine Wettkaempfe gefunden');
    // die Wettkampftage konnten nicht erfolgreich geladen werden -> Ermittlung der Veranstaltung wird auch nicht mÃ¶glich sein
    // somit sollen nur die Veranstaltungen fÃ¼r die Tabelle ermittelt werden, die Veranstaltung kann ja gar nicht mehr erfolgreich ermittelt werden
    // -> this.wettkampfIdEnthalten auf false setzen, damit die Veranstaltungen wie sonst auch geladen werden kÃ¶nnen
    this.wettkampfIdEnthalten = false;
    this.loadingWettkampfe = false;
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

      // als nächstes müssen alle Veranstaltungen fÃ¼r die Tabelle "Veranstaltung" und die aktuelle Veranstaltung
      // für die Ausgabe darunter ermittelt werden
      this.loadVeranstaltungen();
    }
  }
  // Ermittelt die entsprechenden Veranstaltungen wenn ein Jahr aus dem Drop-Down Menü ausgewählt wird.
  public onSelectYear($event: SportjahrVeranstaltungDO): void {
    this.veranstaltungsDataProvider.findBySportyearLaufend($event.sportjahr)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
          this.veranstaltungen = response.payload;
          this.loadingVeranstaltungen = false;
        })
        .catch(() => {
          this.loadVeranstaltungenYearsFailure();
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
        if (sportjahr.sportjahr === this.veranstaltung.sportjahr) {
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
// backend-call um eine Liste der Veranstaltungen eines bestimmten Jahres zu ermitteln
  private async loadVeranstaltungenByYear(year: number): Promise<void> {
    this.veranstaltungen = [];
    this.selectedWettkampf = '';
    this.selectedWettkampfId = null;
    this.veranstaltungsDataProvider.findBySportyearLaufend(year)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
          this.loadVeranstaltungenSuccess(response);
        })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {
          this.loadVeranstaltungenFailure(response);
        });
  }
  // when a Veranstaltung gets selected from the list
  // load LigaTabelle
  public onSelect($event: VeranstaltungDO[]): void {
    // Deaktiviert den GM-Button
    this.disableGMButton = true;
    // Setzt das Array der ausgewählten DTOs zurück
    this.selectedDTOs = [];
    // Weißt die ausgewählten DTOs zu
    this.selectedDTOs = $event;
    // Überprüft, ob ausgewählte DTOs vorhanden sind
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      // Weise die ID der ersten ausgewählten Veranstaltung zu
      this.selectedVeranstaltungId = this.selectedDTOs[0].id;
    }
    // Holt den Namen der aktuellen Veranstaltung über die ID
    this.veranstaltungsDataProvider.findById(this.selectedVeranstaltungId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => {
          // Weißt den Namen der aktuellen Veranstaltung zu
          this.currentVeranstaltungName = response.payload.name + ' ' + response.payload.sportjahr;
        })
        .catch((error) => {
          console.log('Fehler bei onSelect in wkdurchfuehrung');
          console.log(error);
          // Setzt den Namen der aktuellen Veranstaltung auf einen leeren String
          this.currentVeranstaltungName = '';
        });
    // Leert die Arrays für die Zeilen und den Inhalt der Tabelle
    this.rows = [];
    this.tableContent = [];
    // Lädt die Zeilen für die Tabelle, falls eine Veranstaltung ausgewählt wurde
    if (this.selectedVeranstaltungId != null) {
      this.loadTableRows();
    }
  }
  // when a Wettkampftag gets selected from the list --> ID for Buttons
  public onView($event: VersionedDataObject): void {
    // Überprüft, ob ein gültiger Wettkampf ausgewählt wurde
    if ($event.id >= 0) {
      // Weißt die ID des ausgewählten Wettkampfs zu
      this.selectedWettkampfId = $event.id;
      this.selectedWettkampf = $event.id.toString();
      // Bestimmt den Index des ausgewählten Wettkampfs in der Wettkampfliste
      this.selectedWettkampfListeIndex = 0;
      for (let index = 0; index < this.wettkampfListe.length; index++) {
        if (this.wettkampfListe[index].id === this.selectedWettkampfId) {
          this.selectedWettkampfListeIndex = index;
        }
      }
      const wettkampfDO = $event as WettkampfDO;
      // Setzt den Titel für den ausgewählten Wettkampf im HTML-Dokument
      document.getElementById('WettkampfTitle').innerText = this.currentVeranstaltungName +
        ' - ' + wettkampfDO.wettkampfTag + '. Wettkampftag';
      // Aktualisiert die Variable für den ausgewählten Wettkampftag
      this.selectedWettkampftag = wettkampfDO.wettkampfTag + '. Wettkampftag';
      this.selectedWettkampftagURL = wettkampfDO.wettkampfTag;
      // Setzt die Sichtbarkeit der Tabelle auf true
      this.visible = true;
      // Leert den Inhalt der Tabelle
      this.tableContentMatch = [];
      // Zeigt die Matches für den ausgewählten Wettkampf an
      this.showMatches();
    }
    // TODO URL-Sprung bei TabletButtonClick
  }
  public showMatches() {
    this.matchProvider.findAllWettkampfMatchesAndNamesById(this.selectedWettkampfId)
        .then((response: BogenligaResponse<MatchDTOExt[]>) => {
          // Prüft ob Matches schon existieren
          if (response.payload.length !== 0) {
            this.disabledOtherButtons = false;
            this.disableGMButton = true;
          } else {
            this.disabledOtherButtons = true;
            // Prüft, ob es sich um den ersten wettkampftag handelt
            if (this.selectedWettkampfListeIndex  === 0) {
              // Aktiviert generiere Matches Button, da es der erste Wettkampftag ist
              this.disableGMButton = false;

            } else {
              // Fragt ab für vorherigen Wettkampftag
              // selItemid ist 1 für den ersten Eintrag d.h. in der wettkampfListe ist es Eintrag 0
              // daher Selektion für den vorherigen Wettkampftag: selItemId-2
              this.matchProvider.findAllWettkampfMatchesAndNamesById(this.wettkampfListe[this.selectedWettkampfListeIndex - 1].id)
                  .then((response1: BogenligaResponse<MatchDTOExt[]>) => {
                    // Überprüft, ob es keine Matches gibt
                    if (response1.payload.length === 0) {
                      // Wenn keine Matches vorhanden sind, generiere Mateches Button + alle anderen Buttons deaktivieren
                      this.disableGMButton = true;
                      this.disabledOtherButtons = true;
                    } else {
                      // Wenn Matches vorhanden sind, generiere Mateches Button + alle anderen Buttons aktivieren
                      this.disableGMButton = false;
                      this.disabledOtherButtons = false;
                    }
                  })
                  .catch((reason) => {
                    console.error('Error at findAllWettkampfMatchesAndNamesByID: ' + reason);
                  });
            }
          }
          this.handleFindMatchSuccess(response);
          this.loadPassen();
          this.startLiveRefresh();
        })
        .catch(() => this.handleFindMatchFailure());
  }

  // Laedt alle Passen des Wettkampfs nach und aktualisiert die Satz-Spalten der Match-Tabelle
  private loadPassen(): void {
    if (!this.selectedWettkampfId) {
      return;
    }
    this.passeDataProviderService.findByWettkampfId(this.selectedWettkampfId)
        .then((response) => {
          this.passen = response.payload || [];
          this.applySatzergebnisse();
        })
        .catch(() => {
          this.passen = [];
        });
  }

  // Schreibt die Satzsummen aus den Passen in die Match-Zeilen und baut die Tabelle neu auf
  private applySatzergebnisse(): void {
    for (const match of this.tableContentMatch) {
      const summen = this.getSatzSummen(match.id);
      match.satz1 = summen[0];
      match.satz2 = summen[1];
      match.satz3 = summen[2];
      match.satz4 = summen[3];
      match.satz5 = summen[4];
    }
    this.matchRows = toTableRows(this.tableContentMatch);
    this.groupMatches(this.tableContentMatch);
    this.liveAktualisiert = new Date();
  }

  // Summiert je Satz 1-5 die Ringzahlen aller Passen eines Matches; '' solange der Satz nicht geschossen ist
  private getSatzSummen(matchId: number): Array<number | string> {
    const summen: Array<number | string> = [];
    for (let satzNr = 1; satzNr <= 5; satzNr++) {
      const satzPassen = this.passen.filter((p) => p.matchId === matchId && p.lfdNr === satzNr);
      if (satzPassen.length === 0) {
        summen.push('');
        continue;
      }
      let summe = 0;
      for (const passe of satzPassen) {
        for (const ringzahl of passe.ringzahl || []) {
          if (ringzahl != null) {
            summe += ringzahl;
          }
        }
      }
      summen.push(summe);
    }
    return summen;
  }

  // Startet die periodische Live-Aktualisierung der Match-Tabelle (einmalig)
  private startLiveRefresh(): void {
    if (this.liveRefreshSubscription) {
      return;
    }
    this.liveRefreshSubscription = interval(this.liveIntervallSekunden * 1000).subscribe(() => {
      const matchTabelleSichtbar = !this.div2Visible;
      if (!matchTabelleSichtbar || this.isOffline() || !this.selectedWettkampfId
        || document.hidden || this.liveRefreshLaeuft) {
        return;
      }
      this.refreshLive();
    });
  }

  // Holt Matches und Passen erneut, ohne die Button-Logik von showMatches() auszufuehren
  private refreshLive(): void {
    this.liveRefreshLaeuft = true;
    Promise.all([
      this.matchProvider.findAllWettkampfMatchesAndNamesById(this.selectedWettkampfId),
      this.passeDataProviderService.findByWettkampfId(this.selectedWettkampfId)
    ]).then(([matchResponse, passenResponse]) => {
      this.passen = passenResponse.payload || [];
      this.handleFindMatchSuccess(matchResponse);
      this.liveRefreshLaeuft = false;
    }).catch(() => {
      this.liveRefreshLaeuft = false;
    });
  }

  ngOnDestroy(): void {
    if (this.liveRefreshSubscription) {
      this.liveRefreshSubscription.unsubscribe();
      this.liveRefreshSubscription = null;
    }
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
      .path('?wettkampfid=' + this.selectedWettkampfId)
      .build();
  }

  // wenn ein Wettkampftag ausgewählt wurde - dann werden die Button enabled,
  // da die Ligatabelle-ID als Parameter weiter gegeben wird.

  public isDisabled(): boolean {
    return this.disabledOtherButtons; // prüft, ob ein Wettkampf ausgewählt wurde
  }

  // macht buttons unklickbar, wenn die Anwendung offline ist
  public isOfflineDisabled(): boolean {
    return this.onOfflineService.isOffline();
  }
  public isDisabledGMButton(): boolean {
    return this.disableGMButton; // prüft ob der disableGMButton-Wert auf true gesetzt ist & ob ein Wettkampf ausgwählt wurde
  }
  public generateMatches() {
    // Generiert Daten für die Matches basierend auf der ausgewählten Wettkampf-ID
    this.matchDataProvider.generateDataForMatches(this.selectedWettkampfId)
        .then(() => {
          // Zeigt die generierten Matches an
          this.showMatches();
        })
        .catch(() => {
          // Behandelt den Fehler, wenn die Generierung der Matches fehlschlägt
          this.handleFailureGenerateMatchesMissingMitglied();
        });
  }



  private handleFailureGenerateMatchesMissingMitglied(): void {
    this.notificationService.showNotification({
      id: 'NOTIFICATION_GENERIERE_MATCHES_MITGLIED_FEHLT',
      title: 'WKDURCHFUEHRUNG.GENERIERE_MATCHES_MITGLIED_FEHLT.NOTIFICATION.TITLE',
      description: 'WKDURCHFUEHRUNG.GENERIERE_MATCHES_MITGLIED_FEHLT.NOTIFICATION.DESCRIPTION',
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
              const url = '#' + this.router.serializeUrl(
                this.router.createUrlTree(
                  [new UriBuilder().path('/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]).build() ]
                )
              );
              window.open(url, '_blank');
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
        .catch(() => this.handleFindWettkampfFailure());
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
  // Gruppiere die Matches basierend auf der Nummer (nr)
  groupMatches(matchesList: MatchDOExt[]) {
    const groupedMatchesMap = new Map<number, MatchDOExt[]>();
    // Iteriert über die Matches und füge sie der entsprechenden Gruppe in der Map hinzu
    for (const match of matchesList) {
      if (groupedMatchesMap.has(match.matchNr)) {
        groupedMatchesMap.get(match.matchNr)?.push(match);
      } else {
        groupedMatchesMap.set(match.matchNr, [match]);
      }
    }
    // Konvertiert die Map-Einträge in das groupedMatches-Array
    this.groupedMatches = Array.from(groupedMatchesMap.entries()).map(([matchNr, matchList]) => ({
      groupName: `Match ${matchNr}`,
      matches: toTableRows(matchList) // Konvertiere die Matches zu TableRow[]
    }));
  }

  // Verarbeitetdie erfolgreich abgerufenen Matches
  private handleFindMatchSuccess(response: BogenligaResponse<MatchDTOExt[]>): void {
    this.matchRows = []; // reset array to ensure change detection
    this.remainingMatchRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingMatch = false;
    }
    // Konvertiert die MatchDTOExt-Objekte in MatchDOExt-Objekte und speichere sie im tableContentMatch-Array
    this.tableContentMatch = response.payload.map((match) => {
      const tableContentRow: MatchDOExt = new MatchDOExt();
      tableContentRow.id = match.id;
      tableContentRow.matchNr = match.matchNr;
      tableContentRow.begegnung = match.begegnung;
      tableContentRow.matchScheibennummer = match.matchScheibennummer;
      tableContentRow.mannschaftName = match.mannschaftName;
      tableContentRow.mannschaftNameGegner = match.mannschaftNameGegner;
      tableContentRow.matchpunkte = match.matchpunkte;
      tableContentRow.satzpunkte = match.satzpunkte;
      tableContentRow.version = match.version;
      return tableContentRow;
    });
    this.loadingMatch = false;
    // Befuellt die Satz-Spalten aus den geladenen Passen und baut Zeilen + Gruppierung auf
    this.applySatzergebnisse();
  }


  // Ermittlung der anzuzeigenden Jahre
  private async findAvailableYears() {
    this.availableYears = [];

    // lese aktives Sportjahr aus Datenbank aus aus im Online-Modus
    if (!this.onOfflineService.isOffline()) {
      this.aktivesSportjahr = await getActiveSportYear(this.einstellungenDataProvider);
    }

    this.veranstaltungsDataProvider.findAllSportyearDestinct()
        .then((response: BogenligaResponse<SportjahrVeranstaltungDO[]>) => {
          this.loadVeranstaltungenYearsSuccess(response);
        })
        .catch(() => {
          this.loadVeranstaltungenYearsFailure();
        });

  }
  // Ermittlung der Jahre der Veranstaltungen war erfolgreich und fülle availableYears
  private loadVeranstaltungenYearsSuccess(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {

    this.loadingYears = false;
    let counter = 1;
    let indexOfSelectedYear = 0;

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
        // weise die id für jedes jahr in availableYears zu
        sportjahr.id = counter;
        // finde Index von aktivem Sportjahr in der Liste, sonst nimm neustes Jahr (index = 0, siehe Initialisierung)
        if (sportjahr.sportjahr === this.aktivesSportjahr) {
          indexOfSelectedYear = counter - 1;
        }
        counter++;
      }
      if (!this.wettkampfIdEnthalten) {
        // Lade die Veranstaltungen des aktiven Sportjahres oder die des neusten Jahres
        this.selItemId = this.availableYears[indexOfSelectedYear].id;
        this.loadVeranstaltungenByYear(this.availableYears[indexOfSelectedYear].sportjahr.valueOf());
      } else if (this.onOfflineService.isOffline()) {
        this.selItemId = this.availableYears[indexOfSelectedYear].id;
        this.LoadWettkampf();
      }
    }
  }
  // Ermittlung der Jahre der Veranstaltungen war nicht erfolrgreich
  private loadVeranstaltungenYearsFailure(): void {
    this.loadingYears = false;
  }
  addDSBMitglied(): void {
    this.dialog.open(DsbMitgliedDetailPopUpComponent);
  }

  // Navigiert den User, in einem neuem Tab, zur Live-Tabelle
  redirectToFullScreen(veranstaltungId: number): void {
    console.log('selectedWettkampftag wkdurchführung', this.selectedWettkampftag);
    const url = '#' + this.router.serializeUrl(
      this.router.createUrlTree(
        ['wkdurchfuehrung/fullscreen', veranstaltungId, this.selectedWettkampftagURL],
      )
    );
    window.open(url, '_blank');
  }

  // Navigiert den User zu dem Anzeigen-Manager
  redirectToAnzeigenManager(wettkampfID: number, veranstaltungId: number, wettkampftag: number): void {
    const url = '#' + this.router.serializeUrl(
      this.router.createUrlTree(
        ['wkdurchfuehrung/anzeige-manager', wettkampfID, veranstaltungId, wettkampftag],
      )
    );
    window.open(url, '_blank');
  }


  // Navigiert den User zur Schusszettel-Admin-Seite
  public openSchusszettelAdmin(): void {
    if (!this.selectedWettkampfId) {
      console.warn('No Wettkampf selected yet');
      return;
    }
    this.router.navigate([
      '/schusszettel',
      'tablet-setup',
      this.selectedWettkampfId
    ]);
  }

  public openKampfrichterQr(): void {
    if (!this.selectedWettkampfId) {
      return;
    }
    this.kampfrichterQrLoading = true;
    this.kampfrichterQrUrl = null;
    this.kampfrichterAnsichtService.getOrCreateToken(this.selectedWettkampfId)
      .subscribe({
        next: (resp) => {
          const params = new URLSearchParams({
            wettkampfid: this.selectedWettkampfId.toString(),
            token: resp.token
          }).toString();
          this.kampfrichterQrUrl = `${location.origin}/#/schusszettel/kampfrichter?${params}`;
          this.kampfrichterQrLoading = false;
        },
        error: () => {
          this.kampfrichterQrLoading = false;
          alert('Fehler beim Laden des Kampfrichter-Tokens.');
        }
      });
  }

  public closeKampfrichterQr(): void {
    this.kampfrichterQrUrl = null;
  }

  public copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
