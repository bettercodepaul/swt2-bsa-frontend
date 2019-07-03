import {Component, OnInit} from '@angular/core';
import {MatchDO} from '../../types/match-do.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute} from '@angular/router';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {WettkampfDO} from '@vereine/types/wettkampf-do.class';
import {PasseProviderService} from '../../services/passe-provider.service';

class SchuetzeErgebnisse {
  schuetzeNr: number;
  passen: Array<PasseDO>;

  constructor(schuetzeNr: number) {
    this.passen = [];
    this.addPasse();
    this.schuetzeNr = Number.isNaN(schuetzeNr) ? null : schuetzeNr;
  }

  addPasse() {
    let p = new PasseDO();
    p.lfdNr = this.passen.length + 1;
    p.schuetzeNr = this.schuetzeNr;
    this.passen.push(p);
  }
}

const dummyMatch = new MatchDO(
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

const NUM_SCHUETZEN: number = 3;
const STORAGE_KEY_SATZ_NR: string = 'satzNr';
const STORAGE_KEY_SCHEIBE_NR: string = 'scheibenNummer';
const STORAGE_KEY_SCHUETZE_PREFIX: string = 'schuetze';
const STORAGE_KEY_SUBMITTED: string = 'submittedSchuetzenNr';
const STORAGE_KEY_SCHUETZEN: string = 'schuetzen';

@Component({
  selector:    'bla-tableteingabe',
  templateUrl: './tableteingabe.component.html',
  styleUrls:   ['./tableteingabe.component.scss']
})
export class TabletEingabeComponent implements OnInit {

  match1: MatchDO;
  match2: MatchDO;
  currentMatch: MatchDO;
  wettkampf: WettkampfDO;
  scheibenNummer: number;
  satzNr: number;
  schuetzen: Array<SchuetzeErgebnisse>;
  submittedSchuetzenNr: boolean;


  constructor(private schusszettelService: SchusszettelProviderService,
    private passeService: PasseProviderService,
    private route: ActivatedRoute,
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
            .then((data: BogenligaResponse<Array<MatchDO>>) => {
              this.match1 = data.payload[0];
              this.match2 = data.payload[1];
              this.currentMatch = this.match2.scheibenNummer === this.scheibenNummer ? this.match2 : this.match1;
              this.dumpStorageData();
            }, (error) => {
              console.error(error);
            });
      }
    });
  }

  /**
   * Simple method returning an array containing numbers from 1 ... NUM_SCHUETZEN
   */
  static getSchuetzeIdxValues() {
    return Array.apply(null, {length: NUM_SCHUETZEN}).map(Number.call, Number)
  }

  /**
   * Initializes component data using previously stored data in the local storage of the tablet.
   */
  initStorageData() {
    // scheibenNummer has to be set in the tablet administration of wettkampf
    let schNr = Number.parseInt(localStorage.getItem(STORAGE_KEY_SCHEIBE_NR));
    let satzNr = Number.parseInt(localStorage.getItem(STORAGE_KEY_SATZ_NR));
    let subSNr = Number.parseInt(localStorage.getItem(STORAGE_KEY_SUBMITTED));
    if (!isNaN(schNr)) {
      this.scheibenNummer = schNr;
    } else {
      this.showMissingScheibenNummerNotification();
    }
    this.satzNr = (Boolean(satzNr) && !isNaN(satzNr) && satzNr > 0) ? satzNr : 1;
    this.submittedSchuetzenNr = (Boolean(subSNr) && !isNaN(subSNr)) ? subSNr === 1 : false;
    this.initSchuetzen();
  }

  initSchuetzen() {
    let schuetzenString = localStorage.getItem(STORAGE_KEY_SCHUETZEN);
    let schuetzen: Array<SchuetzeErgebnisse> = Boolean(schuetzenString) ? JSON.parse(schuetzenString) : [];
    this.schuetzen = [];
    if (schuetzen.length === 0) {
      for (let i of TabletEingabeComponent.getSchuetzeIdxValues()) {
        let schuetzeNr = Number.parseInt((localStorage.getItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1))));
        this.schuetzen.push(new SchuetzeErgebnisse(schuetzeNr));
      }
    } else {
      for (let schuetze of schuetzen) {
        let schuetzeErgebnisse = new SchuetzeErgebnisse(Number(schuetze.schuetzeNr));
        schuetzeErgebnisse.passen = [];
        for (let passe of schuetze.passen) {
          let passeDO = new PasseDO();
          for (let attr of Object.keys(passe)) {
            passeDO[attr] = passe[attr]
          }
          schuetzeErgebnisse.passen.push(passeDO)
        }
        this.schuetzen.push(schuetzeErgebnisse)
      }
    }
  }

  /**
   * Writes all relevant data of this component to the local storage
   */
  dumpStorageData() {
    localStorage.setItem(STORAGE_KEY_SATZ_NR, this.satzNr.toString());
    localStorage.setItem(STORAGE_KEY_SUBMITTED, this.submittedSchuetzenNr ? Number(1).toString() : Number(0).toString());
    localStorage.setItem(STORAGE_KEY_SCHUETZEN, Boolean(this.schuetzen) ? JSON.stringify(this.schuetzen) : '');
    if (this.hasSchuetzenNummern()) {
      for (let i of TabletEingabeComponent.getSchuetzeIdxValues()) {
        localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1), this.schuetzen[i].schuetzeNr.toString());
      }
    }
  }

  /**
   * Resets parts of the storage data for e.g. starting a new match
   */
  resetStorageData() {
    localStorage.setItem(STORAGE_KEY_SATZ_NR, '');
    localStorage.setItem(STORAGE_KEY_SUBMITTED, '0');
    localStorage.setItem(STORAGE_KEY_SCHUETZEN, '');
    for (let i of TabletEingabeComponent.getSchuetzeIdxValues()) {
      localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + (i + 1), '');
    }
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
    let passe = schuetze.passen[this.satzNr - 1];
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
            schuetze.passen[this.satzNr - 1] = data.payload;
            this.dumpStorageData();
          })
          .catch((err) => {
            console.error(err);
          });
    } else {
      // no id set -> passe is newly created
      this.passeService.create(passe)
          .then((data: BogenligaResponse<PasseDO>) => {
            schuetze.passen[this.satzNr - 1] = data.payload;
            this.dumpStorageData();
          })
          .catch((err) => {
            console.error(err);
          });
    }
  }

  nextSatz() {
    if (this.allPasseFilled()) {
      for (let schuetze of this.schuetzen) {
        schuetze.addPasse()
      }
      this.satzNr++;
      this.dumpStorageData();
    }
  }

  allPasseFilled() {
    let valid = true;
    for (let schuetze of this.schuetzen) {
      valid = valid && this.passeIsValid(schuetze.passen[this.satzNr - 1]);
    }
    return valid;
  }

  private passeIsValid(passe: PasseDO) {
    return (
      passe.ringzahlPfeil1 &&
      passe.ringzahlPfeil1 >= 0 &&
      passe.ringzahlPfeil2 &&
      passe.ringzahlPfeil2 >= 0
    );
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

  private enrichPasseDO(passe: PasseDO, schuetze: SchuetzeErgebnisse) {
    passe.mannschaftId = this.currentMatch.mannschaftId;
    passe.matchNr = this.currentMatch.nr;
    passe.matchId = this.currentMatch.id;
    passe.wettkampfId = this.currentMatch.wettkampfId;
    passe.schuetzeNr = schuetze.schuetzeNr;
  }
}
