import {VersionedDataTransferObject} from '@shared/data-provider';
import {
  SchuetzenstatistikLetzteJahreDTO
} from '@verwaltung/types/datatransfer/schuetzenstatistikletztejahre-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): SchuetzenstatistikLetzteJahreDTO{
  return SchuetzenstatistikLetzteJahreDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): SchuetzenstatistikLetzteJahreDTO[] {
  const list: SchuetzenstatistikLetzteJahreDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
