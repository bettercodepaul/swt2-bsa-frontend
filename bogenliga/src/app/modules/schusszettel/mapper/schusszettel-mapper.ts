import {DataTransferObject} from '@shared/data-provider';
import {MatchDTO} from '../types/datatransfer/match-dto.class';
import {MatchDO} from '../types/match-do.class';
import {PasseDTO} from '../types/datatransfer/passe-dto.class';
import {PasseDO} from '../types/passe-do.class';


export class SchusszettelMapper {

  static matchToDO(payload: MatchDTO): MatchDO {
    return new MatchDO(payload.id,
      payload.mannschaftId,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      payload.matchpunkte,
      payload.satzpunkte);
  }

  static matchToDTO(payload: MatchDO): MatchDTO {
    const passen = [];
    for (let i = 0; i < payload.schuetzen.length; i++) {
      for (let j = 0; j < payload.schuetzen[i].length; j++) {
        passen.push(payload.schuetzen[i][j]);
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
      payload.ringzahl[5])
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
      ringzahl)
  }
}

export function matchToDO(payload: MatchDTO): MatchDO {
  return new MatchDO(payload.id,
    payload.mannschaftId,
    payload.wettkampfId,
    payload.nr,
    payload.begegnung,
    payload.scheibenNummer,
    payload.matchpunkte,
    payload.satzpunkte);
}

// export function matchToDTO(payload: MatchDO): MatchDTO {
//   const passen = [];
//   for (let i = 0; i < payload.schuetzen.length; i++) {
//     for (let j = 0; j < payload.schuetzen[i].length; j++) {
//       passen.push(payload.schuetzen[i][j]);
//     }
//   }
//   return new MatchDTO(payload.id,
//     payload.mannschaftId,
//     payload.wettkampfId,
//     payload.nr,
//     payload.begegnung,
//     payload.scheibenNummer,
//     payload.matchpunkte,
//     payload.satzpunkte,
//     passen);
// }
//
// export function passeToDO(payload: PasseDTO): PasseDO {
//   return new PasseDO(payload.id,
//     payload.mannschaftId,
//     payload.wettkampfId,
//     payload.matchNr,
//     payload.lfdnr,
//     payload.dsbMitgliedNr,
//     payload.ringzahl[0],
//     payload.ringzahl[1],
//     payload.ringzahl[2],
//     payload.ringzahl[3],
//     payload.ringzahl[4],
//     payload.ringzahl[5])
// }
//
// export function passeToDTO(payload: PasseDO): PasseDTO {
//   const ringzahl = [
//       payload.ringzahlPfeil1,
//       payload.ringzahlPfeil2,
//       payload.ringzahlPfeil3,
//       payload.ringzahlPfeil4,
//       payload.ringzahlPfeil5,
//       payload.ringzahlPfeil6
//     ]
//   ;
//   return new PasseDTO(payload.id,
//     payload.mannschaftId,
//     payload.wettkampfId,
//     payload.matchNr,
//     payload.lfdnr,
//     payload.dsbMitgliedNr,
//     ringzahl)
// }

// export function fromPayloadArray(payload: DataTransferObject[]): Array<MatchDTO> {
//   const list: Array<MatchDTO> = [];
//   payload.forEach((single) => list.push(fromPayload(single)));
//   return list;
// }
