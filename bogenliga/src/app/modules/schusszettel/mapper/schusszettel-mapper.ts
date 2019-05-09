import {MatchDTO} from '../types/datatransfer/match-dto.class';
import {MatchDO} from '../types/match-do.class';
import {PasseDTO} from '../types/datatransfer/passe-dto.class';
import {PasseDO} from '../types/passe-do.class';


export class SchusszettelMapper {

  static matchToDO(payload: MatchDTO): MatchDO {
    let schuetzen = [];
    if (payload.passen.length > 0) {
      schuetzen[0] = [];
      schuetzen[1] = [];
      schuetzen[2] = [];
      for (let passe of payload.passen) {
        switch (passe.schuetzeNr) {
          case 1:
            schuetzen[0].push(this.passeToDO(passe));
            break;
          case 2:
            schuetzen[1].push(this.passeToDO(passe));
            break;
          case 3:
            schuetzen[2].push(this.passeToDO(passe));
            break;
        }

      }
    }
    return new MatchDO(payload.id,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      0,
      0,
      0,
      0,
      0,
      payload.matchpunkte,
      payload.satzpunkte,
      schuetzen);
  }

  static matchToDTO(payload: MatchDO): MatchDTO {
    const passen = [];
    for (let i = 0; i < payload.schuetzen.length; i++) {
      for (let j = 0; j < payload.schuetzen[i].length; j++) {
        payload.schuetzen[i][j].schuetzeNr = payload.schuetzen[i][0].schuetzeNr;
        passen.push(this.passeToDTO(payload.schuetzen[i][j]));
      }
    }
    return new MatchDTO(payload.id,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      payload.matchpunkte,
      payload.satzpunkte,
      passen);
  }

  static passeToDO(payload: PasseDTO): PasseDO {
    return new PasseDO(payload.id,
      payload.matchId,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.matchNr,
      payload.lfdNr,
      payload.dsbMitgliedId,
      payload.ringzahl[0],
      payload.ringzahl[1],
      payload.ringzahl[2],
      payload.ringzahl[3],
      payload.ringzahl[4],
      payload.ringzahl[5],
      payload.schuetzeNr)
  }

  static passeToDTO(payload: PasseDO): PasseDTO {
    const ringzahl = [
        payload.ringzahlPfeil1,
        payload.ringzahlPfeil2,
        payload.ringzahlPfeil3,
        payload.ringzahlPfeil4,
        payload.ringzahlPfeil5,
        payload.ringzahlPfeil6
      ];
    return new PasseDTO(payload.id,
      payload.matchId,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.matchNr,
      payload.lfdNr,
      payload.dsbMitgliedId,
      ringzahl,
      payload.schuetzeNr)
  }
}

