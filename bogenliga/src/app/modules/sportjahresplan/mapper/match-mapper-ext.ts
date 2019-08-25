import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {MatchDOExt} from '../types/match-do-ext.class';
import {PasseMapper} from './passe-mapper';
import {VersionedDataTransferObject} from '@shared/data-provider';


export function fromPayload(payload: VersionedDataTransferObject): MatchDTOExt {
  return MatchDTOExt.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MatchDTOExt[] {
  const list: MatchDTOExt[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}


export class MatchMapperExt {

  static matchToDO(payload: MatchDTOExt): MatchDOExt {
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
            schuetzen[0].push(PasseMapper.passeToDO(passe));
            break;
          case 2:
            schuetzen[1].push(PasseMapper.passeToDO(passe));
            break;
          case 3:
            schuetzen[2].push(PasseMapper.passeToDO(passe));
            break;
        }

      }
      for (let i = 0; i < schuetzen[0].length; i++) {
        for (const passen of schuetzen) {
          if (i < passen.length) {
            sumSatz[i] += passen[i].ringzahlPfeil1 + passen[i].ringzahlPfeil2;
          }
        }
      }
    }
    const fehlerpunkte = [
      payload.strafPunkteSatz1,
      payload.strafPunkteSatz2,
      payload.strafPunkteSatz3,
      payload.strafPunkteSatz4,
      payload.strafPunkteSatz5
    ];

    return new MatchDOExt(payload.id,
      payload.mannschaftId,
      payload.mannschaftName,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      sumSatz,
      payload.matchpunkte,
      payload.satzpunkte,
      fehlerpunkte,
      schuetzen,
      payload.wettkampfTag,
      payload.wettkampfTyp);
  }

  static matchToDTO(payload: MatchDOExt): MatchDTOExt {
    const passen = [];
    for (const schuetze of payload.schuetzen) {
      for (const passe of schuetze) {
        passe.schuetzeNr = schuetze[0].schuetzeNr;
        passen.push(PasseMapper.passeToDTO(passe));
      }
    }

    const strafPunkteSatz1 = payload.fehlerpunkte[0];
    const strafPunkteSatz2 = payload.fehlerpunkte[1];
    const strafPunkteSatz3 = payload.fehlerpunkte[2];
    const strafPunkteSatz4 = payload.fehlerpunkte[3];
    const strafPunkteSatz5 = payload.fehlerpunkte[4];

    return new MatchDTOExt(payload.id,
      payload.mannschaftId,
      payload.mannschaftName,
      payload.wettkampfId,
      payload.nr,
      payload.begegnung,
      payload.scheibenNummer,
      payload.matchpunkte,
      payload.satzpunkte,
      strafPunkteSatz1,
      strafPunkteSatz2,
      strafPunkteSatz3,
      strafPunkteSatz4,
      strafPunkteSatz5,
      passen,
      payload.wettkampfTag,
      payload.wettkampfTyp);
  }
}
