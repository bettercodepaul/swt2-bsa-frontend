import {Component, OnInit} from '@angular/core';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse} from '../../../shared/data-provider';
import {isUndefined} from '../../../shared/functions';
import {ActivatedRoute, Router} from '@angular/router';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services';
import {WettkampfDO} from '../../../vereine/types/wettkampf-do.class';
import {PasseProviderService} from '../../services/passe-provider.service';
import {MatchProviderService} from '../../services/match-provider.service';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {STORAGE_KEY_TABLET_SESSION} from '../tablet-admin/tablet-admin.component';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';

class SchuetzeErgebnisse {
  schuetzeNr: number;
  passen: Array<PasseDO>;

  constructor(schuetzeNr: number) {
    this.passen = [];
    this.addPasse();
    this.schuetzeNr = Number.isNaN(schuetzeNr) ? null : schuetzeNr;
  }

  addPasse() {
    const p = new PasseDO();
    p.lfdNr = this.passen.length + 1;
    p.schuetzeNr = this.schuetzeNr;
    this.passen.push(p);
  }
}

const dummyMatch = new MatchDOExt(
  null,
  null,
  null,
  1,
  1,
  1,
  1,
  [],
  1,
  1,
  null,
  null
);

const NUM_SCHUETZEN = 3;
const STORAGE_KEY_SCHUETZE_PREFIX = 'schuetze';
const STORAGE_KEY_SUBMITTED = 'submittedSchuetzenNr';
const STORAGE_KEY_SCHUETZEN = 'schuetzen';

const NOTIFICATION_CONFIRM_NEXT_MATCH = 'tabletEingabeConfirmNextMatch';

@Component({
  selector:    'bla-tableteingabe',
  templateUrl: './tableteingabe.component.html',
  styleUrls:   ['./tableteingabe.component.scss']
})
export class TabletEingabeComponent implements OnInit {

  match1: MatchDOExt;
  match2: MatchDOExt;
  currentMatch: MatchDOExt;
  wettkampf: WettkampfDO;
  tabletSession: TabletSessionDO;
  tabletAdminRoute: string;
  schuetzen: Array<SchuetzeErgebnisse>;
  submittedSchuetzenNr: boolean;

  /**
   * Simple method returning an array containing numbers from 1 ... NUM_SCHUETZEN
   */
  static getSchuetzeIdxValues() {
    return Array.apply(null, {length: NUM_SCHUETZEN}).map(Number.call, Number);
  }

  constructor(private schusszettelService: SchusszettelProviderService,
              private passeService: PasseProviderService,
              private matchService: MatchProviderService,
              private tabletSessionService: TabletSessionProviderService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  /**
   * Called when component is initialized.
   */
  ngOnInit() {
    this.initStorageData();

    this.match1 = dummyMatch;
    this.match2 = dummyMatch;
    this.currentMatch = dummyMatch;

    this.route.params.subscribe((params) => {
      if (!isUndefined(params['match1id']) && !isUndefined(params['match2id'])) {
        const match1id = params['match1id'];
        const match2id = params['match2id'];
        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDOExt>>) => {
              this.match1 = data.payload[0];
              this.match2 = data.payload[1];
              if (this.tabletSession) {
                this.currentMatch = this.match2.scheibenNummer === this.tabletSession.scheibenNr ? this.match2 : this.match1;
              }
              this.tabletAdminRoute = '/tabletadmin/' + this.match1.wettkampfId;
              this.tabletSession.matchID = this.currentMatch.id;
              this.updateTabletSession();
              this.dumpStorageData();
            }, (error) => {
              console.error(error);
            });
      }
    });
  }

  /**
   * Initializes component data using previously stored data in the local storage of the tablet.
   */
  initStorageData() {
    const subSNr = Number.parseInt(localStorage.getItem(STORAGE_KEY_SUBMITTED), 10);
    try {
      // tabletSession has to be set in the tablet administration of wettkampf
      this.tabletSession = JSON.parse(localStorage.getItem(STORAGE_KEY_TABLET_SESSION));
      if (!this.tabletSession.satzNr) {
        this.tabletSession.satzNr = 1;
        this.updateTabletSession();
      }
    } catch (e) {
      this.showMissingScheibenNummerNotification();
    }
    this.submittedSchuetzenNr = (Boolean(subSNr) && !isNaN(subSNr)) ? subSNr === 1 : false;
    this.initSchuetzen();
  }

  initSchuetzen() {
    const schuetzenString = localStorage.getItem(STORAGE_KEY_SCHUETZEN);
    const schuetzen: Array<SchuetzeErgebnisse> = Boolean(schuetzenString) ? JSON.parse(schuetzenString) : [];
    this.schuetzen = [];
    if (schuetzen.length === 0) {
      for (const i of TabletEingabeComponent.getSchuetzeIdxValues()) {
        const schuetzeNr = Number.parseInt((localStorage.getItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1))), 10);
        this.schuetzen.push(new SchuetzeErgebnisse(schuetzeNr));
      }
    } else {
      for (const schuetze of schuetzen) {
        const schuetzeErgebnisse = new SchuetzeErgebnisse(Number(schuetze.schuetzeNr));
        schuetzeErgebnisse.passen = [];
        for (const passe of schuetze.passen) {
          const passeDO = new PasseDO();
          for (const attr of Object.keys(passe)) {
            passeDO[attr] = passe[attr];
          }
          schuetzeErgebnisse.passen.push(passeDO);
        }
        this.schuetzen.push(schuetzeErgebnisse);
      }
    }
  }

  /**
   * Writes all relevant data of this component to the local storage
   */
  dumpStorageData() {
    localStorage.setItem(STORAGE_KEY_TABLET_SESSION, JSON.stringify(this.tabletSession));
    localStorage.setItem(STORAGE_KEY_SUBMITTED, this.submittedSchuetzenNr ? Number(1).toString() : Number(0).toString());
    localStorage.setItem(STORAGE_KEY_SCHUETZEN, Boolean(this.schuetzen) ? JSON.stringify(this.schuetzen) : '');
    if (this.hasSchuetzenNummern()) {
      for (const i of TabletEingabeComponent.getSchuetzeIdxValues()) {
        localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1), this.schuetzen[i].schuetzeNr.toString());
      }
    }
  }

  /**
   * Resets parts of the storage data for e.g. starting a new match
   */
  resetStorageData() {
    localStorage.setItem(STORAGE_KEY_SUBMITTED, '0');
    localStorage.setItem(STORAGE_KEY_SCHUETZEN, '');
    for (const i of TabletEingabeComponent.getSchuetzeIdxValues()) {
      localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1), '');
    }
    this.schuetzen = [];
    this.submittedSchuetzenNr = false;
  }

  submitSchuetzenNr() {
    if (this.hasValidSchuetzenNr()) {
      this.submittedSchuetzenNr = true;
      this.dumpStorageData();
    }
  }

  hasValidSchuetzenNr() {
    return (Boolean(this.schuetzen) &&
      this.schuetzen[0].schuetzeNr !== null &&
      this.schuetzen[1].schuetzeNr !== null &&
      this.schuetzen[2].schuetzeNr !== null &&
      this.schuetzen[0].schuetzeNr > 0 &&
      this.schuetzen[1].schuetzeNr > 0 &&
      this.schuetzen[2].schuetzeNr > 0);
  }

  hasSchuetzenNummern() {
    return (this.hasValidSchuetzenNr() && this.submittedSchuetzenNr);
  }

  onChange(value: number, ringzahlNr: number, schuetze: SchuetzeErgebnisse) {
    const passe = schuetze.passen[this.tabletSession.satzNr - 1];
    passe['ringzahlPfeil' + ringzahlNr] = value;
    if (this.passeIsValid(passe)) {
      this.enrichPasseDO(passe, schuetze);
      this.createOrUpdatePasse(passe, schuetze);
    }
  }

  createOrUpdatePasse(passe: PasseDO, schuetze: SchuetzeErgebnisse) {
    // passe was already created, only update it
    if (passe.id !== null) {
      this.passeService.update(passe)
          .then((data: BogenligaResponse<PasseDO>) => {
            schuetze.passen[this.tabletSession.satzNr - 1] = data.payload;
            this.dumpStorageData();
          })
          .catch((err) => {
            console.error(err);
          });
    } else {
      // no id set -> passe is newly created
      this.passeService.create(passe)
          .then((data: BogenligaResponse<PasseDO>) => {
            schuetze.passen[this.tabletSession.satzNr - 1] = data.payload;
            this.dumpStorageData();
          })
          .catch((err) => {
            console.error(err);
          });
    }
  }

  nextSatz() {
    if (this.allPasseFilled()) {
      for (const schuetze of this.schuetzen) {
        schuetze.addPasse();
      }
      this.tabletSession.satzNr++;
      this.updateTabletSession();
      this.dumpStorageData();
    }
  }

  allPasseFilled() {
    let valid = true;
    for (const schuetze of this.schuetzen) {
      valid = valid && this.passeIsValid(schuetze.passen[this.tabletSession.satzNr - 1]);
    }
    return valid;
  }

  /**
   * Trigger switch to the next match on this wettkampftag
   * TODO: Button "Nächstes Match" anzeigen, wenn Match vorbei ist, bedeutet:
   * 5 Sätze voll oder nach 3 Sätzen schon gewonnen -> irgendwie herausfinden
   */
  nextMatch() {
    this.showConfirmNextMatchNotification();
    this.notificationService.observeNotification(NOTIFICATION_CONFIRM_NEXT_MATCH)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.showNextMatchNotification();
            this.matchService.next(this.currentMatch.id)
                .then((data) => {
                  if (data.payload.length === 2) {
                    this.resetStorageData();
                    this.initStorageData();
                    this.router.navigate(['/schusszettel/' + data.payload[0] + '/' + data.payload[1] + '/tablet']);
                    this.notificationService.discardNotification();
                  } else {
                    // Ende des Wettkampftages, do something
                  }
                });
          }
        });
  }

  updateTabletSession() {
    if (this.tabletSession) {
      this.tabletSessionService.update(this.tabletSession)
          .then((data) => {
            this.tabletSession = data.payload;
            this.dumpStorageData();
          });
    }
  }

  showMissingScheibenNummerNotification() {
    this.notificationService.showNotification({
      id:          'tabletScheibenNummerMissing',
      title:       'Konfigurationsfehler',
      description: 'Für dieses Gerät wurde noch keine Scheibennummer zugewiesen. Bitte holen Sie dies in der Wettkampf-Administration nach.',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.SYSTEM,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    });
  }

  showConfirmNextMatchNotification() {
    this.notificationService.showNotification({
      id:          NOTIFICATION_CONFIRM_NEXT_MATCH,
      title:       'Nächstes Match starten',
      description: 'Wollen Sie wirklich das nächste Match starten?',
      severity:    NotificationSeverity.QUESTION,
      origin:      NotificationOrigin.SYSTEM,
      type:        NotificationType.YES_NO,
      userAction:  NotificationUserAction.PENDING
    });
  }

  showNextMatchNotification() {
    this.notificationService.showNotification({
      id:          'tabletEingabeNextMatch',
      title:       'Lädt ...',
      description: 'Das nächste anstehende Match auf dieser Scheibe wird geladen...',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    });
  }

  private passeIsValid(passe: PasseDO) {
    return (
      passe.ringzahlPfeil1 &&
      passe.ringzahlPfeil1 >= 0 &&
      passe.ringzahlPfeil2 &&
      passe.ringzahlPfeil2 >= 0
    );
  }

  private enrichPasseDO(passe: PasseDO, schuetze: SchuetzeErgebnisse) {
    passe.mannschaftId = this.currentMatch.mannschaftId;
    passe.matchNr = this.currentMatch.nr;
    passe.matchId = this.currentMatch.id;
    passe.wettkampfId = this.currentMatch.wettkampfId;
    passe.schuetzeNr = schuetze.schuetzeNr;
  }
}
