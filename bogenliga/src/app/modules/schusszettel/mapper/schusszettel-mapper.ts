import {MatchDTO} from '../types/datatransfer/match-dto.class';
import {MatchDO} from '../types/match-do.class';
import {PasseDTO} from '../types/datatransfer/passe-dto.class';
import {PasseDO} from '../types/passe-do.class';


export class SchusszettelMapper {

  static matchToDO(payload: MatchDTO): MatchDO {
    let schuetzen = [];
    //for (let passe of payload.passen) {
      //todo: falls passen schon existieren -> schuetzen-array korrekt befüllen, summen für sätze bestimmen
    //}
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
        payload.schuetzen[i][j].schuetzenNr = payload.schuetzen[i][0].schuetzenNr;
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
      payload.mannschaftId,
      payload.wettkampfId,
      payload.matchNr,
      payload.lfdnr,
      payload.dsbMitgliedNr,
      payload.ringzahl[0],
      payload.ringzahl[1],
      payload.ringzahl[2],
      payload.ringzahl[3],
      payload.ringzahl[4],
      payload.ringzahl[5],
      payload.schuetzenNr)
  }

  static passeToDTO(payload: PasseDO): PasseDTO {
    const ringzahl = [
        payload.ringzahlPfeil1,
        payload.ringzahlPfeil2,
        payload.ringzahlPfeil3,
        payload.ringzahlPfeil4,
        payload.ringzahlPfeil5,
        payload.ringzahlPfeil6
      ]
    ;
    return new PasseDTO(payload.id,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.matchNr,
      payload.lfdnr,
      payload.dsbMitgliedNr,
      ringzahl,
      payload.schuetzenNr)
  }
}

