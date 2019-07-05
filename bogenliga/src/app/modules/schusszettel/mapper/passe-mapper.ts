import {PasseDTO} from '../types/datatransfer/passe-dto.class';
import {PasseDO} from '../types/passe-do.class';


export class PasseMapper {
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
