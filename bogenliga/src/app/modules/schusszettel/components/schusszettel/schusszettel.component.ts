import {Component, OnInit} from '@angular/core';
import {MatchDO} from '../../types/match-do.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType, NotificationUserAction
} from '@shared/services';


@Component({
  selector:    'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls:   ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  match1: MatchDO;
  match2: MatchDO;

  constructor(private schusszettelService: SchusszettelProviderService,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    console.log('Schusszettel Component');
  }

  /**
   * Called when component is initialized.
   *
   * Initializes the match objects needed for template bindings,
   * then reads the matchIds from url and gets them via schusszettel-service.
   */
  ngOnInit() {
    // initialwert schützen inputs

    this.match1 = new MatchDO(null, null, null, 1, 1, 1, 1, []);
    this.match1.nr = 1;
    this.match1.schuetzen = [];

    this.match2 = new MatchDO(null, null, null, 1, 1, 1, 1, []);
    this.match2.nr = 1;
    this.match2.schuetzen = [];

    this.initSchuetzen();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params['match1id']) && !isUndefined(params['match2id'])) {
        const match1id = params['match1id'];
        const match2id = params['match2id'];
        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDO>>) => {
              this.match1 = data.payload[0];
              this.match2 = data.payload[1];
              if (this.match1.schuetzen.length <= 0 || this.match2.schuetzen.length <= 0) {
                this.initSchuetzen();
              } else {
                this.initSumSatz();
                this.setPoints();
              }
            }, (error) => {
              console.log(error);
            });
      }
    });
  }

  /**
   * Initializes schuetzen-array of matches.
   * Pushes three arrays into schuetzen, then pushes five PasseDO in each of the three arrays.
   */
  private initSchuetzen() {
    for (let i = 0; i < 3; i++) {
      this.match1.schuetzen.push(new Array<PasseDO>());
      this.match2.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i === 0) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else if (i === 1) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        }
      }

    }
  }

  /**
   * Called when ngModel for passe.ringzahlPfeilx changes.
   * If the new, inputed value contains a '+', the ringzahl is set to 10.
   * With the params, the correct PasseDO and its ringzahlPfeilx is selected and set.
   * The value is a string, so before setting the ringzahl it needs to be parsed to number.
   * After that, sets the match's sumSatzx depending on which Satz was edited.
   * @param value
   * @param matchNr
   * @param schuetzenNr
   * @param satzNr
   * @param pfeilNr
   */
  onChange(value: any, matchNr: number, schuetzenNr: number, satzNr: number, pfeilNr: number) {
    const match = this['match' + matchNr];
    if (value.indexOf('+') !== -1) {
      switch (pfeilNr) {
        case 1:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil1 = 10;
          break;
        case 2:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil2 = 10;
          break;
      }
    } else {
      value = +value; // value ist string, ringzahlen sollen number sein -> value in number umwandeln
      switch (pfeilNr) {
        case 1:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil1 = value > 0 ? value : null;
          break;
        case 2:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil2 = value > 0 ? value : null;
          break;
      }
    }
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
  }

  /**
   * Adds each ringzahlen of all three schuetzen of the match of the Satz and returns it.
   * @param match
   * @param satzNr
   */
  private getSumSatz(match: MatchDO, satzNr: number): number {
    return match.schuetzen[0][satzNr].ringzahlPfeil1 + match.schuetzen[0][satzNr].ringzahlPfeil2
      + match.schuetzen[1][satzNr].ringzahlPfeil1 + match.schuetzen[1][satzNr].ringzahlPfeil2
      + match.schuetzen[2][satzNr].ringzahlPfeil1 + match.schuetzen[2][satzNr].ringzahlPfeil2;
  }

  /**
   * Sets satzpunkte and matchpunkte of both matches according to the sumSatzx and satzpunkte.
   */
  private setPoints() {
    let counterMatch1 = 0;
    let counterMatch2 = 0;
    for (let i = 0; i < 5; i++) {
      if (this.match1.sumSatz[i] > this.match2.sumSatz[i]) {
        counterMatch1++;
      } else if (this.match1.sumSatz[i] < this.match2.sumSatz[i]) {
        counterMatch2++;
      }
    }
    const draws = 5 - (counterMatch1 + counterMatch2);
    this.match1.satzpunkte = (counterMatch1 * 2) + draws;
    this.match2.satzpunkte = (counterMatch2 * 2) + draws;
    if (this.match1.satzpunkte > this.match2.satzpunkte) {
      this.match1.matchpunkte = 2;
      this.match2.matchpunkte = 0;
    } else if (this.match1.satzpunkte < this.match2.satzpunkte) {
      this.match1.matchpunkte = 0;
      this.match2.matchpunkte = 2;
    } else {
      this.match1.matchpunkte = 1;
      this.match2.matchpunkte = 1;
    }
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
          this.initSumSatz();
          this.setPoints();
          this.notificationService.discardNotification();
        }, (error) => {
          console.log(error);
          this.notificationService.discardNotification();
        });
  }

  private initSumSatz() {
    for (let i = 0; i < 5; i++) {
      this.match1.sumSatz[i] = this.getSumSatz(this.match1, i);
      this.match2.sumSatz[i] = this.getSumSatz(this.match2, i);
    }
  }
}
