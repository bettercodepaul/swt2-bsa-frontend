import {VersionedDataTransferObject} from '@shared/data-provider';
import {SchuetzenstatistikDTO} from '@verwaltung/types/datatransfer/schuetzenstatistik-dto.class';
import {SchuetzenstatistikDO} from '@verwaltung/types/schuetzenstatistik-do.class';


export function fromPayload(payload: VersionedDataTransferObject): SchuetzenstatistikDTO {
  return SchuetzenstatistikDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): SchuetzenstatistikDTO[] {
  const list: SchuetzenstatistikDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function ToDO(payload: SchuetzenstatistikDTO): SchuetzenstatistikDO {

  return new SchuetzenstatistikDO(
    payload.id,
    payload.version,
    payload.mannschaftsId,
    payload.dsbMitgliedId,
    payload.dsbMitgliedName,
    payload.mannschaftNummer,
    payload.matchId,
    payload.matchNr,
    payload.pfeilpunkteSchnitt,
    payload.rueckenNummer,
    payload.veranstaltungId,
    payload.veranstaltungName,
    payload.vereinId,
    payload.vereinName,
    payload.wettkampfId,
    payload.wettkampfTag,
  );
}

export function ToDTO(payload: SchuetzenstatistikDO): SchuetzenstatistikDTO {

  return new SchuetzenstatistikDTO(
    payload.id,
    payload.version,
    payload.mannschaftsId,
    payload.dsbMitgliedId,
    payload.dsbMitgliedName,
    payload.mannschaftNummer,
    payload.matchId,
    payload.matchNr,
    payload.pfeilpunkteSchnitt,
    payload.rueckenNummer,
    payload.veranstaltungId,
    payload.veranstaltungName,
    payload.vereinId,
    payload.vereinName,
    payload.wettkampfId,
    payload.wettkampfTag,
  );
}
