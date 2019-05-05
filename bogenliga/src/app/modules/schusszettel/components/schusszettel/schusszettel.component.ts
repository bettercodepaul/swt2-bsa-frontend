import {Component, OnInit} from '@angular/core';
import {MatchDO} from '../../types/match-do.class';
import {PasseDO} from '../../types/passe-do.class';


@Component({
  selector:    'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls:   ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  match1: MatchDO;
  match2: MatchDO;

  constructor() {
    console.log('Schusszettel Component')
  }

  ngOnInit() {
    //initialwert schützen inputs

    this.match1 = new MatchDO();
    this.match1.matchNr = 1;
    this.match1.sumSatz1 = 0;
    this.match1.sumSatz2 = 0;
    this.match1.sumSatz3 = 0;
    this.match1.sumSatz4 = 0;
    this.match1.sumSatz5 = 0;
    this.match1.satzpunkte = 0;
    this.match1.matchpunkte = 0;

    this.match2 = new MatchDO();
    this.match2.matchNr = 1;
    this.match2.sumSatz1 = 0;
    this.match2.sumSatz2 = 0;
    this.match2.sumSatz3 = 0;
    this.match2.sumSatz4 = 0;
    this.match2.sumSatz5 = 0;
    this.match2.satzpunkte = 0;
    this.match2.matchpunkte = 0;

    for (let i = 0; i < 3; i++) {
      this.match1.schuetzen.push(new Array<PasseDO>());
      this.match2.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i == 0) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.matchNr, i + 1));
        } else if (i == 1) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.matchNr, i + 1));
        } else {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1));
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.matchNr, i + 1));
        }
      }

    }
  }


  onChange(value: any, matchNr: number, schuetzenNr: number, satzNr: number, pfeilNr: number) {
    let match = this['match' + matchNr];
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
      value = +value; //value ist string, ringzahlen sollen number sein -> value in number umwandeln
      switch (pfeilNr) {
        case 1:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil1 = value > 0 ? value : null;
          break;
        case 2:
          match.schuetzen[schuetzenNr][satzNr].ringzahlPfeil2 = value > 0 ? value : null;
          break;
      }
    }
    switch (satzNr) {
      case 0:
        match.sumSatz1 = this.getSumSatz(match, satzNr);
        break;
      case 1:
        match.sumSatz2 = this.getSumSatz(match, satzNr);
        break;
      case 2:
        match.sumSatz3 = this.getSumSatz(match, satzNr);
        break;
      case 3:
        match.sumSatz4 = this.getSumSatz(match, satzNr);
        break;
      case 4:
        match.sumSatz5 = this.getSumSatz(match, satzNr);
        break;
    }
    this.setPoints();

  }

  private getSumSatz(match: MatchDO, satzNr: number): number {
    return match.schuetzen[0][satzNr].ringzahlPfeil1 + match.schuetzen[0][satzNr].ringzahlPfeil2
      + match.schuetzen[1][satzNr].ringzahlPfeil1 + match.schuetzen[1][satzNr].ringzahlPfeil2
      + match.schuetzen[2][satzNr].ringzahlPfeil1 + match.schuetzen[2][satzNr].ringzahlPfeil2;
  }

  private setPoints() {
    let counterMatch1 = 0;
    let counterMatch2 = 0;
    for (let i = 0; i < 5; i++) {
      if (this.match1['sumSatz' + (i+1)] > this.match2['sumSatz' + (i+1)]) {
        counterMatch1++;
      } else if (this.match1['sumSatz' + (i+1)] < this.match2['sumSatz' + (i+1)]) {
        counterMatch2++;
      }
    }
    let draws = 5 - (counterMatch1 + counterMatch2);
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
}
