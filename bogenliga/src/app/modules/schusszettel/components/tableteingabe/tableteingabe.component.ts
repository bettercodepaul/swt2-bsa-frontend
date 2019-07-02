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
    this.schuetzeNr = Number.isNaN(schuetzeNr) ? null : schuetzeNr;
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
  scheibenNummer: Number;
  satzNr: Number;
  schuetzen: Array<SchuetzeErgebnisse>;


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

  /**
   * Initializes component data using previously stored data in the local storage of the tablet.
   */
  initStorageData() {
    // scheibenNummer has to be set in the tablet administration of wettkampf
    let sNr = Number.parseInt(localStorage.getItem(STORAGE_KEY_SCHEIBE_NR));
    let satzNr = Number.parseInt((localStorage.getItem(STORAGE_KEY_SATZ_NR)));
    if (!isNaN(sNr)) {
      this.scheibenNummer = sNr;
    } else {
      this.showMissingScheibenNummerNotification();
    }
    this.satzNr = (satzNr !== null && !isNaN(satzNr)) ? satzNr : 1;
    this.schuetzen = [];
    for (let i of Array(NUM_SCHUETZEN)) {
      this.schuetzen.push(new SchuetzeErgebnisse(Number.parseInt((localStorage.getItem(STORAGE_KEY_SCHUETZE_PREFIX + i + 1)))));
    }
  }

  dumpStorageData() {
    localStorage.setItem(STORAGE_KEY_SATZ_NR, this.satzNr.toString());
    if (this.hasSchuetzenNummern()) {
      for (let i of Array(NUM_SCHUETZEN)) {
        localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + i + 1, this.schuetzen[i].schuetzeNr.toString());
      }
    }
  }

  resetStorageData() {
    localStorage.setItem(STORAGE_KEY_SATZ_NR, '');
    for (let i of Array(NUM_SCHUETZEN)) {
      localStorage.setItem(STORAGE_KEY_SCHUETZE_PREFIX + i + 1, '');
    }
  }

  hasSchuetzenNummern() {
    return (Boolean(this.schuetzen) &&
      this.schuetzen[0].schuetzeNr !== null &&
      this.schuetzen[1].schuetzeNr !== null &&
      this.schuetzen[2].schuetzeNr !== null &&
      this.schuetzen[0].schuetzeNr > 0 &&
      this.schuetzen[1].schuetzeNr > 0 &&
      this.schuetzen[2].schuetzeNr > 0);
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
    this.schusszettelService.create(this.match1, this.match2)
        .then((data: BogenligaResponse<Array<MatchDO>>) => {
          this.match1 = data.payload[0];
          this.match2 = data.payload[1];
          this.notificationService.discardNotification();
          this.dumpStorageData();
        }, (error) => {
          console.error(error);
          this.notificationService.discardNotification();
        });
  }
}
