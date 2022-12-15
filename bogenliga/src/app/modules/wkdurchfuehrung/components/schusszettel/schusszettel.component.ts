import {Component, OnInit} from '@angular/core';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse, RequestResult, UriBuilder} from '../../../shared/data-provider';
import {MatchProviderService} from '../../services/match-provider.service';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction,
  OnOfflineService
} from '../../../shared/services';
import {environment} from '@environment';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {LigatabelleDataProviderService} from '../../../ligatabelle/services/ligatabelle-data-provider.service';


const NOTIFICATION_ZURUECK = 'schusszettel-weiter';
const NOTIFICATION_WEITER_SCHALTEN = 'schusszettel_weiter';
const NOTIFICATION_SCHUSSZETTEL_EINGABEFEHLER = 'schusszettelEingabefehler';
const NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN = 'schusszettelEntschieden';
const NOTIFICATION_SCHUSSZETTEL_SPEICHERN = 'schusszettelSave';
const NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER = 'schusszettelEntschieden';
const NOTIFACTION_SCHUETZE = 'schuetze';


@Component({
  selector:    'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls:   ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  match1: MatchDOExt;
  match2: MatchDOExt;
  dirtyFlag: boolean;
  match1singlesatzpoints = [];
  match2singlesatzpoints = [];
  popupSelberTag: boolean;
  popupAndererTag: boolean;
  mannschaften: DsbMannschaftDO[] = [];
  vereine: VereinDO[] = [];
  allPasse: PasseDoClass[] = [];
  allWettkaempfe: WettkampfDO[];
  allVeranstaltungen: VeranstaltungDO[];
  passeSelberTag: number;
  passeAndererTag: number;
  selberTagVeranstaltung: string;
  andererTagVeranstaltung: VeranstaltungDO;
  andererTagAnzahl: number;
  ligaleiterAktuelleLiga: string;
  ligaleiterVorherigeLiga: string;

  matchMannschaft: DsbMannschaftDO;
  matchAllPasseMannschaft: PasseDoClass[];
  wettkampf: WettkampfDO;
  veranstaltung: VeranstaltungDO;
  matchAllPasse = new Array<PasseDO>();

  selberWettkampftag = new Array<boolean>();
  selberWettkampftagVeranstaltung = Array<VeranstaltungDO>();
  vorherigerWettkampf: WettkampfDO;
  vorherigeVeranstaltung: VeranstaltungDO;
  anzahlAnTagenMannschaft = new Array<Array<number>>();
  veranstaltungVorherig: VeranstaltungDO;
  veranstaltungGegenwaertig: VeranstaltungDO;

  allowedMitglieder1: number[];
  allowedMitglieder2: number[];




  constructor(private router: Router,
              private schusszettelService: SchusszettelProviderService,
              private ligatabelleService: LigatabelleDataProviderService,
              private matchProvider: MatchProviderService,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private vereinDataProvider: VereinDataProviderService,
              private dsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private passeDataProvider: PasseDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private veranstaltungDataProvider: VeranstaltungDataProviderService,
              private mannschaftsMitgliedDataProvider: MannschaftsmitgliedDataProviderService,
              private onOfflineService: OnOfflineService
  ) {
  }

  /**
   * Called when component is initialized.
   *
   * Initializes the match objects needed for template bindings,
   * then reads the matchIds from url and gets them via schusszettel-service.
   */
  ngOnInit() {
    // initialwert schützen inputs

    this.match1 = new MatchDOExt(null, null, null, 1, 1, 1, 1, [], 0, 0, null, null);
    this.match1.nr = 1;
    this.match1.schuetzen = [];
    this.match1singlesatzpoints = [];

    this.match2 = new MatchDOExt(null, null, null, 1, 1, 1, 1, [], 0, 0, null, null);
    this.match2.nr = 1;
    this.match2.schuetzen = [];
    this.match2singlesatzpoints = [];

    // am Anfang sind keine Änderungen
    this.dirtyFlag = false;
    // this.initSchuetzen();
    this.initSchuetzenMatch1();
    this.initSchuetzenMatch2();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params['match1id']) && !isUndefined(params['match2id'])) {
        const match1id = params['match1id'];
        const match2id = params['match2id'];

        // Notification while preparing
        this.notificationService.showNotification({
          id:          'NOTIFICATION_SCHUSSZETTEL_LOADING',
          title:       'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.LADEN.TITLE',
          description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.LADEN.DESCRIPTION',
          severity:    NotificationSeverity.INFO,
          origin:      NotificationOrigin.USER,
          userAction:  NotificationUserAction.PENDING
        });


        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDOExt>>) => {

              this.match1 = data.payload[0];
              this.match2 = data.payload[1];

              /**
               * Limits the Schützen of match 1 to 3 and each passe-array
               * for each Schütze to 5
               * Only a maximum of 15 passe for each match will be possible
               */

              if (this.match1.schuetzen.length != 0) {

                if (this.match1.schuetzen.length > 3) {
                  for (let i = this.match1.schuetzen.length; i > 3; i--) {
                    this.match1.schuetzen.pop();
                  }
                }

                for (let i = 0; i < 3; i++) {
                  if (this.match1.schuetzen[i].length > 5 && this.match1.schuetzen[i].length != 0) {
                    for (let j = this.match1.schuetzen[i].length; j > 5; j--) {
                      this.match1.schuetzen[i].pop();
                    }
                  }
                }
              }
                /**
                 * Limits the Schützen of match 2 to 3 and each passe-array
                 * for each Schütze to 5
                 * Only a maximum of 15 passe for each match will be possible
                 */
              if (this.match2.schuetzen.length != 0) {

                if (this.match2.schuetzen.length > 3) {
                  for (let i = this.match2.schuetzen.length; i > 3; i--) {
                    this.match2.schuetzen.pop();
                  }
                }

                for ( let i = 0; i < 3; i++) {
                  if (this.match2.schuetzen[i].length > 5 && this.match1.schuetzen[i].length != 0) {
                    for (let j = this.match2.schuetzen[i].length; j > 5; j--) {
                      this.match2.schuetzen[i].pop();
                    }
                  }
                }
              }




              console.log('match1', this.match1);
              console.log('match2', this.match2);
              let shouldInitSumSatz = true;
              if (this.match1.schuetzen.length <= 0) {
                this.initSchuetzenMatch1();
                shouldInitSumSatz = false;
              }

              if (this.match2.schuetzen.length <= 0) {
                this.initSchuetzenMatch2();
                shouldInitSumSatz = false;
              }


              if (shouldInitSumSatz) {
                this.initSumSatz();
                this.setPoints();
              }

              this.wettkampfDataProvider.findAllowedMember(this.match1.wettkampfId, this.match1.mannschaftId, this.match2.mannschaftId).then((value) => {
                this.allowedMitglieder1 = value;
                console.log('Allowed for match1: ', this.allowedMitglieder1);
                if (this.match1.wettkampfId === this.match2.wettkampfId) {
                  this.allowedMitglieder2 = this.allowedMitglieder1;
                  // Close notification when ready
                  this.notificationService.discardNotification();
                }
              });
              if (this.match1.wettkampfId !== this.match2.wettkampfId) {
                this.wettkampfDataProvider.findAllowedMember(this.match2.wettkampfId, this.match1.mannschaftId, this.match2.mannschaftId).then((value) => {
                  this.allowedMitglieder2 = value;
                  console.log('Allowed for match2: ', this.allowedMitglieder2);
                  // Close notification when ready
                  this.notificationService.discardNotification();
                });
              }
              if (this.onOfflineService.isOffline()) {
                this.notificationService.discardNotification();
              }
            })
            .catch((error) => {
              console.error(error);
            });

      }
    });
    /*
    this.getAllMannschaften();
    this.getAllVerein();
    this.getAllPasse();
    this.getAllWettkaempfe();
    this.getAllVeranstaltungen();
    */
  }

  /**
   * Called when ngModel for passe.ringzahlPfeilx changes.
   * If the new, inputed value contains a '+', the ringzahl is set to 10.
   * With the params, the correct PasseDO and its ringzahlPfeilx is selected and set.
   * The value is a string, so before setting the ringzahl it needs to be parsed to number.
   * After that, sets the match's sumSatzx depending on which Satz was edited.
   * @param value
   * @param matchNr
   * @param rueckennnummer
   * @param satzNr
   * @param pfeilNr
   */
  onChange(value: string, matchNr: number, rueckennummer: number, satzNr: number, pfeilNr: number) {


    const match = this['match' + matchNr];
    const satz = match.schuetzen[rueckennummer][satzNr];
    let realValue = parseInt(value, 10); // value ist string, ringzahlen sollen number sein -> value in number umwandeln
    realValue = realValue >= 0 ? realValue : null;
    pfeilNr === 1 ? satz.ringzahlPfeil1 = realValue : satz.ringzahlPfeil2 = realValue;
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
    this.dirtyFlag = true; // Daten geändert
  }

  async onSchuetzeChange(value: string, matchNr: number, rueckennummer: number) {
    const mannschaftId = matchNr === 1 ? this.match1.mannschaftId : this.match2.mannschaftId;

    let valid = true;
    let allowed = [];
    let mitglied = null;

    try {
      mitglied = await this.mannschaftsMitgliedDataProvider.findByTeamIdAndRueckennummer(mannschaftId, value);
    } catch (e) {
      valid = false;
    }

    if (mitglied != null && mitglied.result === RequestResult.SUCCESS) {
      const dsbNummer = mitglied.payload.dsbMitgliedId;
      console.log('DsbNummer for Mannschaftsmitglied in Mannschaft ' +
        mannschaftId + ' and Rueckennummer ' + value + ' is ' + dsbNummer);

      // tslint:disable-next-line:triple-equals
      allowed = matchNr == 1 ? this.allowedMitglieder1 : this.allowedMitglieder2;

      if (!allowed.includes(dsbNummer)) {
        valid = false;
      }
    }

    if (!valid) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.TITLE',
        description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    }
  }

  onFehlerpunkteChange(value: string, matchNr: number, satzNr: number) {
    const match = this['match' + matchNr];
    let realValue = parseInt(value, 10); // value ist string, ringzahlen sollen number sein -> value in number -->
                                         // umwandeln
    realValue = realValue >= 1 ? realValue : null;
    match.fehlerpunkte[satzNr] = realValue;
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
    this.dirtyFlag = true; // Daten geändert
  }


  private getAllMannschaften(): void {
    this.dsbMannschaftDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => {
          this.mannschaften = response.payload;
        });
  }

  private getAllVerein(): void {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => {
          this.vereine = response.payload;
        });
  }

  private getAllPasse(): void {
    this.passeDataProvider.findAll()
        .then((response: BogenligaResponse<PasseDoClass[]>) => {
          this.allPasse = response.payload;
        });
  }

  private getAllWettkaempfe(): void {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => {
          this.allWettkaempfe = response.payload;
        });
  }

  /**
   * Diese Methode wurde überprüft und wird momentan nicht verwendet. Daher wurde hier die Methode findAll() nicht
   * geändert bzw. angepasst.
   * @private
   */

  /*
   private getAllVeranstaltungen(): void {
   this.veranstaltungDataProvider.findAll()
   .then((response: BogenligaResponse<VeranstaltungDO[]>) => {
   this.allVeranstaltungen = response.payload;
   });
   }
   */


  private maxMannschaftsId(): number {
    let maxMid = this.mannschaften[0].id;
    this.mannschaften.forEach((mannschaft) => {
      if (mannschaft.id > maxMid) {
        maxMid = mannschaft.id;
      }
    });
    return maxMid;
  }

  savepopSelberTag() {
    this.popupSelberTag = true;
  }

  savepopAndererTag() {
    this.popupAndererTag = true;
  }

  // Hier muss die Update funktion aufgreufen werden.
 async save() {


   let alt_match1 = null;
   let alt_match2 = null;
   if (this.onOfflineService.isOffline()) {
      const matchd = await this.matchProvider.getmatchoffline(this.match1.nr);
      const matchdaten = matchd.payload;

      matchdaten.forEach((match) => {
        if (match.mannschaftId === this.match1.mannschaftId) {
          alt_match1 = match;
        } else if (match.mannschaftId === this.match2.mannschaftId) {
          alt_match2 = match;
        }
      });
   }


   if (this.match1.satzpunkte > 7 || this.match2.satzpunkte > 7) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
        title:       'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.TITLE',
        description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else if (
      // zum Speichern konsitenteer Daten müssen alle Schützennnummern erfasst sein
      // daher prüfen wir hier ersten auf "leer" d.h. gleich 0
      this.match1.schuetzen[0][0].rueckennummer == null ||
      this.match1.schuetzen[1][0].rueckennummer == null ||
      this.match1.schuetzen[2][0].rueckennummer == null ||
      this.match2.schuetzen[0][0].rueckennummer == null ||
      this.match2.schuetzen[1][0].rueckennummer == null ||
      this.match2.schuetzen[2][0].rueckennummer == null) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.TITLE',
        description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else if (
      // und jetzt prüfen wir noch ob in einer Mannschaft die gleiche
      // Schützennummer zweimal angegeben wurde -> auch nicht möglich
      this.match1.schuetzen[0][0].rueckennummer === this.match1.schuetzen[1][0].rueckennummer ||
      this.match1.schuetzen[1][0].rueckennummer === this.match1.schuetzen[2][0].rueckennummer ||
      this.match1.schuetzen[2][0].rueckennummer === this.match1.schuetzen[0][0].rueckennummer ||
      this.match2.schuetzen[0][0].rueckennummer === this.match2.schuetzen[1][0].rueckennummer ||
      this.match2.schuetzen[1][0].rueckennummer === this.match2.schuetzen[2][0].rueckennummer ||
      this.match2.schuetzen[2][0].rueckennummer === this.match2.schuetzen[0][0].rueckennummer) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.TITLE',
        description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SPEICHERN',
        title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.TITLE',
        description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.DESCRIPTION',
        severity:    NotificationSeverity.INFO,
        origin:      NotificationOrigin.USER,
        // type: NotificationType.OK, //--TO-DO Maximilian
        userAction:  NotificationUserAction.PENDING
      });

      // im Ausgabefeld ist die Schutzennummer aktuell nur in der 0-ten Passe gesetzt
      // kopieren in jede Passe, damit Datenanlage möglich --> Schüsselwert für DB
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 5; j++) {
          if (this.match1.schuetzen[i][j].lfdNr <= 1) {
            this.match1.schuetzen[i][j].lfdNr = j + 1;
          }
          if (this.match2.schuetzen[i][j].lfdNr <= 1) {
            this.match2.schuetzen[i][j].lfdNr = j + 1;
          }

          this.match1.schuetzen[i][j].dsbMitgliedId = this.match1.schuetzen[i][0].dsbMitgliedId;
          this.match2.schuetzen[i][j].dsbMitgliedId = this.match2.schuetzen[i][0].dsbMitgliedId;

          this.match1.schuetzen[i][j].rueckennummer = this.match1.schuetzen[i][0].rueckennummer;
          this.match2.schuetzen[i][j].rueckennummer = this.match2.schuetzen[i][0].rueckennummer;
        }
      }

      this.schusszettelService.create(this.match1, this.match2)
          .then((data: BogenligaResponse<Array<MatchDOExt>>) => {
            this.match1 = data.payload[0];
            this.match2 = data.payload[1];

            // neu initialisieren, damit passen die noch keine ID haben eine ID vom Backend erhalten
            this.ngOnInit();
            this.notificationService.showNotification({
              id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
              title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.TITLE',
              description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.DESCRIPTION',
              severity:    NotificationSeverity.ERROR,
              origin:      NotificationOrigin.SYSTEM,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.ACCEPTED
            });
          }, (error) => {
            console.error(error);
            this.notificationService.showNotification({
              id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
              title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.TITLE',
              description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.DESCRIPTION',
              severity:    NotificationSeverity.ERROR,
              origin:      NotificationOrigin.SYSTEM,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.ACCEPTED
            });
            this.notificationService.discardNotification();
          });


      if (this.onOfflineService.isOffline()) {
        await this.ligatabelleService.updateLigatabelleVeranstaltung(this.match1, alt_match1, this.match2, alt_match2);
      }
      this.dirtyFlag = false; // Daten gespeichert

    }
  }

  // zurueck zu wkdurchfuehrung
  back() {
    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO Texte in json.de anlegen
      const notification: Notification = {
        id:          NOTIFICATION_ZURUECK,
        title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.ZURUECK.TITLE',
        description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.ZURUECK.DESCRIPTION',
        severity:    NotificationSeverity.QUESTION,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.YES_NO,
        userAction:  NotificationUserAction.PENDING
      };

      console.log('show notification');
      this.notificationService.showNotification(notification);

      console.log('notification.userAction before: ' + notification.userAction);
      this.notificationService.observeNotification(NOTIFICATION_ZURUECK)
          .subscribe((myNotification) => {
            console.log('observe notification');
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              console.log('accepted');
              this.dirtyFlag = false;
              console.log('Wettkampftag', this.match1.wettkampfTag);
              this.router.navigate(['/wkdurchfuehrung' + '/' + this.match1.wettkampfId]);
            }
            console.log('notification.userAction after: ' + notification.userAction);
          });

    } else {

      console.log('Keine Änderung');
      console.log('Wettkampftag', this.match1.wettkampfTag);
      this.router.navigate(['/wkdurchfuehrung' + '/' + this.match1.wettkampfId]);
    }
  }


  next() {

    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO TExte in json.de anlegen
      const notification: Notification = {
        id:          NOTIFICATION_WEITER_SCHALTEN,
        title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.WEITER.TITLE',
        description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.WEITER.DESCRIPTION',
        severity:    NotificationSeverity.QUESTION,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.YES_NO,
        userAction:  NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_WEITER_SCHALTEN)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.dirtyFlag = false;
              this.matchProvider.pairToFollow(this.match2.id)
                  .then((data) => {
                    if (data.payload.length === 2) {
                      this.router.navigate(['/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
                    }
                  });
            }
          });
      this.notificationService.showNotification(notification);

    } else {
      // nächste Matches bestimmen --> schusszettel-service --> Backend-Call --> zwei IDs
      this.matchProvider.pairToFollow(this.match2.id)
          .then((data) => {
            if (data.payload.length === 2) {
              this.router.navigate(['/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
            }
          });
    }


  }


  previous() {
    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO TExte in json.de anlegen
      const notification: Notification = {
        id:          NOTIFICATION_WEITER_SCHALTEN,
        title:       'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.WEITER.TITLE',
        description: 'wkdurchfuehrung.SCHUSSZETTEL.NOTIFICATION.WEITER.DESCRIPTION',
        severity:    NotificationSeverity.QUESTION,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.YES_NO,
        userAction:  NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_WEITER_SCHALTEN)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.dirtyFlag = false;
              this.matchProvider.previousPair(this.match1.id)
                  .then((data) => {
                    if (data.payload.length === 2) {
                      this.router.navigate(['/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
                    }
                  });
            }
          });
      this.notificationService.showNotification(notification);

    } else {
      // nächste Matches bestimmen --> schusszettel-service --> Backend-Call --> zwei IDs
      this.matchProvider.previousPair(this.match1.id)
          .then((data) => {
            if (data.payload.length === 2) {
              this.router.navigate(['/wkdurchfuehrung/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
            }
          });
    }


  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  /**
   * Initializes schuetzen-array of matches.
   * Pushes three arrays into schuetzen for match 1, then pushes five PasseDO in each of the three arrays.
   */
  private initSchuetzenMatch1() {

    // 1.löschen der Felder
    this.match1singlesatzpoints = [];
    this.match1.sumSatz = [];

    // 2. intialisieren der Felder mit 5 Einträgen des Werts 0
    for (let i = 0; i < 5; i++) {
      this.match1.sumSatz.push(0);
      this.match1singlesatzpoints.push(0);
    }
    this.match1.schuetzen = [];

    // Vorbelegen der Felder mit den Daten des Matches
    for (let i = 0; i < 3; i++) {
      this.match1.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i === 0) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        } else if (i === 1) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        } else {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        }
      }
    }
  }


  /**
   * Initializes schuetzen-array of matches.
   * Pushes three arrays into schuetzen for match 2, then pushes five PasseDO in each of the three arrays.
   */
  private initSchuetzenMatch2() {

    // 1.löschen der Felder
    this.match2singlesatzpoints = [];
    this.match2.sumSatz = [];

    // 2. intialisieren der Felder mit 5 Einträgen des Werts 0
    for (let i = 0; i < 5; i++) {
      this.match2.sumSatz.push(0);
      this.match2singlesatzpoints.push(0);
    }
    this.match2.schuetzen = [];
    // Vorbelegen der Felder mit den Daten des Matches
    for (let i = 0; i < 3; i++) {
      this.match2.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i === 0) {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else if (i === 1) {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        }
      }
    }
  }


  /**
   * Adds each ringzahlen of all three schuetzen of the match of the Satz and returns it.
   * @param match
   * @param satzNr
   */
  private getSumSatz(match: MatchDOExt, satzNr: number): number {
    let sum = 0;
    for (const i of Object.keys(match.schuetzen)) {
      sum += match.schuetzen[i][satzNr].ringzahlPfeil1;
      sum += match.schuetzen[i][satzNr].ringzahlPfeil2;
      if (sum > 0 && match.schuetzen[i][satzNr].ringzahlPfeil1 == null) {
        match.schuetzen[i][satzNr].ringzahlPfeil1 = 0;
      }
      if (sum > 0 && match.schuetzen[i][satzNr].ringzahlPfeil2 == null) {
        match.schuetzen[i][satzNr].ringzahlPfeil2 = 0;
      }
    }
    sum -= match.fehlerpunkte[satzNr];

    return sum;
  }

  /**
   * Sets satzpunkte and matchpunkte of both matches according to the sumSatzx and satzpunkte.
   */
  private setPoints() {
    // kumulativ
    if (this.match1.wettkampfTyp === 'Liga kummulativ') {
      this.setKummulativePoints();
    } else {
      this.setSatzPoints();
    }

    if (this.match1.satzpunkte >= 6) {
      this.match1.matchpunkte = 2;
      this.match2.matchpunkte = 0;
    } else if (this.match2.satzpunkte >= 6) {
      this.match1.matchpunkte = 0;
      this.match2.matchpunkte = 2;
    } else if (this.match2.satzpunkte === 5 && this.match1.satzpunkte === 5) {
      this.match1.matchpunkte = 1;
      this.match2.matchpunkte = 1;
    }
  }

  private setSatzPoints() {

    let counterMatch1 = 0;
    let counterMatch2 = 0;

    for (let i = 0; i < 5; i++) {
      if (this.match1.sumSatz[i] > this.match2.sumSatz[i]) {
        counterMatch1 += 2;
        this.match1singlesatzpoints[i] = 2;
        this.match2singlesatzpoints[i] = 0;
      } else if (this.match1.sumSatz[i] < this.match2.sumSatz[i]) {
        counterMatch2 += 2;
        this.match1singlesatzpoints[i] = 0;
        this.match2singlesatzpoints[i] = 2;
      } else if (this.match1.sumSatz[i] === this.match2.sumSatz[i] &&
        this.match1.sumSatz[i] > 0 && this.match2.sumSatz[i] > 0) {
        counterMatch1++;
        counterMatch2++;
        this.match1singlesatzpoints[i] = 1;
        this.match2singlesatzpoints[i] = 1;
      }
    }
    this.match1.satzpunkte = counterMatch1;
    this.match2.satzpunkte = counterMatch2;
    this.match1.matchpunkte = 0;
    this.match2.matchpunkte = 0;

  }

  private setKummulativePoints() {
    let kumuluativ1 = 0;
    let kumuluativ2 = 0;

    for (let i = 0; i < 3; i++) {
      kumuluativ1 += this.match1.sumSatz[i];
      kumuluativ2 += this.match2.sumSatz[i];
    }

    if (kumuluativ1 > kumuluativ2) {
      this.match1.satzpunkte = 6;
      this.match2.satzpunkte = 0;
    } else if (kumuluativ1 < kumuluativ2) {
      this.match1.satzpunkte = 0;
      this.match2.satzpunkte = 6;
    }
  }

  private initSumSatz() {

    for (let i = 0; i < 5; i++) {
      this.match1.sumSatz[i] = this.getSumSatz(this.match1, i);
      this.match2.sumSatz[i] = this.getSumSatz(this.match2, i);
    }

  }

  private getSummeSchuetze(schuetzeNr: number, matchNr: number): number {
    let sum = 0;
    const match = this['match' + matchNr];
    for (const passe of match.schuetzen[schuetzeNr]) {
      sum += passe.ringzahlPfeil1 + passe.ringzahlPfeil2;
    }
    return sum;
  }

  public onButtonDownload(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path(this.match1.id + '/' + this.match2.id)
      .build();
  }

}
