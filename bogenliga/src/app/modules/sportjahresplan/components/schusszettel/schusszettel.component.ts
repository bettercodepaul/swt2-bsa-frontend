import {Component, OnInit} from '@angular/core';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse, UriBuilder} from '../../../shared/data-provider';
import {MatchProviderService} from '../../services/match-provider.service';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services';
import {environment} from '@environment';

const NOTIFICATION_WEITER_SCHALTEN = 'schusszettel_weiter';
const NOTIFICATION_SCHUSSZETTEL_EINGABEFEHLER = 'schusszettelEingabefehler';
const NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN = 'schusszettelEntschieden';
const NOTIFICATION_SCHUSSZETTEL_SPEICHERN = 'schusszettelSave';
const NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER = 'schusszettelEntschieden';


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

  constructor(private router: Router,
              private schusszettelService: SchusszettelProviderService,
              private matchProvider: MatchProviderService,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
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
        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDOExt>>) => {
              this.match1 = data.payload[0];
              this.match2 = data.payload[1];
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
            }, (error) => {
              console.error(error);
            });

      }
    });
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

  onFehlerpunkteChange(value: string, matchNr: number, satzNr: number) {
    const match = this['match' + matchNr];
    let realValue = parseInt(value, 10); // value ist string, ringzahlen sollen number sein -> value in number --> umwandeln
    realValue = realValue >= 1 ? realValue : null;
    match.fehlerpunkte[satzNr] = realValue;
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
    this.dirtyFlag = true; // Daten geändert
  }

  save() {
    if (this.match1.satzpunkte > 7 || this.match2.satzpunkte > 7) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.DESCRIPTION',
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
        this.match2.schuetzen[2][0].rueckennummer == null ) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.DESCRIPTION',
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
      this.match2.schuetzen[2][0].rueckennummer === this.match2.schuetzen[0][0].rueckennummer ) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else {
      this.notificationService.showNotification({
        id: 'NOTIFICATION_SCHUSSZETTEL_SPEICHERN',
        title: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.DESCRIPTION',
        severity: NotificationSeverity.INFO,
        origin: NotificationOrigin.USER,
        // type: NotificationType.OK, //--TO-DO Maximilian
        userAction: NotificationUserAction.PENDING
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
            title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.TITLE',
            description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.DESCRIPTION',
            severity:    NotificationSeverity.ERROR,
            origin:      NotificationOrigin.SYSTEM,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.ACCEPTED
          });
        }, (error) => {
          console.error(error);
          this.notificationService.showNotification({
            id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
            title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.TITLE',
            description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.DESCRIPTION',
            severity:    NotificationSeverity.ERROR,
            origin:      NotificationOrigin.SYSTEM,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.ACCEPTED
        });
          this.notificationService.discardNotification();
        });
      this.dirtyFlag = false; // Daten gespeichert
    }
  }

  next() {

    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO TExte in json.de anlegen
      const notification: Notification = {
        id:               NOTIFICATION_WEITER_SCHALTEN,
        title: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.WEITER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.WEITER.DESCRIPTION',
        severity:         NotificationSeverity.QUESTION,
        origin:           NotificationOrigin.USER,
        type:             NotificationType.YES_NO,
        userAction:       NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_WEITER_SCHALTEN)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.dirtyFlag = false;
            this.matchProvider.pairToFollow(this.match2.id)
              .then((data) => {
                if (data.payload.length === 2) {
                  this.router.navigate(['/sportjahresplan/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
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
            this.router.navigate(['/sportjahresplan/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
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
    } else  {
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
