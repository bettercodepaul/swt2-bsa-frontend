import {MatchDTO} from '../types/datatransfer/match-dto.class';
import {MatchDO} from '../types/match-do.class';
import {PasseDTO} from '../types/datatransfer/passe-dto.class';
import {PasseDO} from '../types/passe-do.class';


export class SchusszettelMapper {

  static matchToDO(payload: MatchDTO): MatchDO {
    const schuetzen = [];
    let sumSatz = [];
    if (payload.passen.length > 0) {
      schuetzen[0] = [];
      schuetzen[1] = [];
      schuetzen[2] = [];
      sumSatz = [0, 0, 0, 0, 0];
      for (const passe of payload.passen) {
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
      for (let i = 0; i < schuetzen[0].length; i++) {
        for (const schuetze of schuetzen) {
          sumSatz[i] += schuetze[i].ringzahlPfeil1 + schuetze[i].ringzahlPfeil2;
        }
      }
    }
    return new MatchDO(payload.id,
      payload.mannschaftId,
      payload.mannschaftName,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      sumSatz,
      payload.matchpunkte,
      payload.satzpunkte,
      schuetzen,
      payload.wettkampfTyp);
  }

  static matchToDTO(payload: MatchDO): MatchDTO {
    const passen = [];
    for (const schuetze of payload.schuetzen) {
      for (const passe of schuetze) {
        passe.schuetzeNr = schuetze[0].schuetzeNr;
        passen.push(this.passeToDTO(passe));
      }
    }
    return new MatchDTO(payload.id,
      payload.mannschaftId,
      payload.mannschaftName,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      payload.matchpunkte,
      payload.satzpunkte,
      passen,
      payload.wettkampfTyp);
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
      payload.schuetzeNr);
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
      payload.schuetzeNr);
  }
}

