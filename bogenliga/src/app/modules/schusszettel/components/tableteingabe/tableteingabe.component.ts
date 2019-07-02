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

class SchuetzeErgebnisse {
  schuetzeNr: Number;
  passen: Array<PasseDO>;

  constructor(schuetzeNr: number) {
    this.passen = [];
    this.addPasse();
    this.schuetzeNr = Number.isNaN(schuetzeNr) ? null : schuetzeNr;
  }

  addPasse() {
    let p = new PasseDO();
    p.lfdNr = this.passen.length + 1;
    p.schuetzeNr = Number(this.schuetzeNr);
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
      for (let i of schuetzen) {
        let s = new SchuetzeErgebnisse(Number(i.schuetzeNr));
        s.passen = [];
        for (let passe of i.passen) {
          let p = new PasseDO();
          for (let k of passe) {
            p[k] = passe[k]
          }
          s.passen.push(p)
        }
        this.schuetzen.push(s)
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
      valid = valid && (
        schuetze.passen[this.satzNr - 1].ringzahlPfeil1 &&
        schuetze.passen[this.satzNr - 1].ringzahlPfeil1 >= 0 &&
        schuetze.passen[this.satzNr - 1].ringzahlPfeil2 &&
        schuetze.passen[this.satzNr - 1].ringzahlPfeil2 >= 0
      );
    }
    return valid;
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

  save() {
    this.notificationService.showNotification({
      id:          'schusszettelSave',
      title:       'Lädt...',
      description: 'Schusszettel wird gespeichert...',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    });
    this.schusszettelService.create(this.currentMatch, this.match2) // TODO: add service for submitting single match
        .then((data: BogenligaResponse<Array<MatchDO>>) => {
          this.currentMatch = data.payload[0];
          this.notificationService.discardNotification();
          this.dumpStorageData();
        }, (error) => {
          console.error(error);
          this.notificationService.discardNotification();
        });
  }
}
