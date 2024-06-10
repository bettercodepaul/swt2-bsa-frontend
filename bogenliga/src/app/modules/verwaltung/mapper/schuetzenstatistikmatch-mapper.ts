import {VersionedDataTransferObject} from '@shared/data-provider';
import {SchuetzenstatistikMatchDTO} from '@verwaltung/types/datatransfer/schuetzenstatistikmatch-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): SchuetzenstatistikMatchDTO {
  return SchuetzenstatistikMatchDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): SchuetzenstatistikMatchDTO[] {
  const list: SchuetzenstatistikMatchDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
