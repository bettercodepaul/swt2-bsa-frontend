import {VersionedDataTransferObject} from '@shared/data-provider';
import {
  SchuetzenstatistikWettkampftageDTO
} from '@verwaltung/types/datatransfer/schuetzenstatistikwettkampftage-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): SchuetzenstatistikWettkampftageDTO{
  return SchuetzenstatistikWettkampftageDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): SchuetzenstatistikWettkampftageDTO[] {
  const list: SchuetzenstatistikWettkampftageDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
