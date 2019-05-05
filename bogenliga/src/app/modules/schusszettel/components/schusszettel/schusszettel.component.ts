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
  sum1: number = 0;
  sum2: number = 0;
  sum3: number = 0;
  sum4: number = 0;
  sum5: number = 0;

  constructor() {
    console.log('Schusszettel Component')
  }

  ngOnInit() {
    //initialwert schützen inputs

    this.match1 = new MatchDO();

    for (let i = 0; i < 3; i++) {
      this.match1.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i == 0) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1))
        } else if (i == 1) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1))
        } else {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.matchNr, i + 1))
        }
      }

    }
  }


  onChange(value: any, schuetzenNr: number, satzNr: number, pfeilNr: number) {
    if (value.indexOf('+') !== -1) {
      switch (pfeilNr) {
        case 1:
          this.match1.schuetzen[schuetzenNr][satzNr].ringzahlPfeil1 = 10;
          break;
        case 2:
          this.match1.schuetzen[schuetzenNr][satzNr].ringzahlPfeil2 = 10;
          break;
      }
    } else {
      value = +value;
      switch (pfeilNr) {
        case 1:
          this.match1.schuetzen[schuetzenNr][satzNr].ringzahlPfeil1 = value.length > 0 ? value : null;
          break;
        case 2:
          this.match1.schuetzen[schuetzenNr][satzNr].ringzahlPfeil2 = value.length > 0 ? value : null;
          break;
      }
    }
    if (satzNr == 0) {
      this.sum1 = this.match1.schuetzen[0][0].ringzahlPfeil1 + this.match1.schuetzen[0][0].ringzahlPfeil2
        + this.match1.schuetzen[1][0].ringzahlPfeil1 + this.match1.schuetzen[1][0].ringzahlPfeil2
        + this.match1.schuetzen[2][0].ringzahlPfeil1 + this.match1.schuetzen[2][0].ringzahlPfeil2;
    }
    if (satzNr == 1) {
      this.sum2 = +this.match1.schuetzen[0][1].ringzahlPfeil1 + this.match1.schuetzen[0][1].ringzahlPfeil2
        + this.match1.schuetzen[1][1].ringzahlPfeil1 + this.match1.schuetzen[1][1].ringzahlPfeil2
        + this.match1.schuetzen[2][1].ringzahlPfeil1 + this.match1.schuetzen[2][1].ringzahlPfeil2;
    }
    if (satzNr == 2) {
      this.sum3 = +this.match1.schuetzen[0][2].ringzahlPfeil1 + this.match1.schuetzen[0][2].ringzahlPfeil2
        + this.match1.schuetzen[1][2].ringzahlPfeil1 + this.match1.schuetzen[1][2].ringzahlPfeil2
        + this.match1.schuetzen[2][2].ringzahlPfeil1 + this.match1.schuetzen[2][2].ringzahlPfeil2;
    }
    if (satzNr == 3) {
      this.sum4 = +this.match1.schuetzen[0][3].ringzahlPfeil1 + this.match1.schuetzen[0][3].ringzahlPfeil2
        + this.match1.schuetzen[1][3].ringzahlPfeil1 + this.match1.schuetzen[1][3].ringzahlPfeil2
        + this.match1.schuetzen[2][3].ringzahlPfeil1 + this.match1.schuetzen[2][3].ringzahlPfeil2;
    }
    if (satzNr == 4) {
      this.sum5 = +this.match1.schuetzen[0][4].ringzahlPfeil1 + this.match1.schuetzen[0][4].ringzahlPfeil2
        + this.match1.schuetzen[1][4].ringzahlPfeil1 + this.match1.schuetzen[1][4].ringzahlPfeil2
        + this.match1.schuetzen[2][4].ringzahlPfeil1 + this.match1.schuetzen[2][4].ringzahlPfeil2;
    }
  }
}
