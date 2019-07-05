import {VersionedDataTransferObject} from '@shared/data-provider';
import {PasseDTOClass} from '@verwaltung/types/datatransfer/passe-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): PasseDTOClass {
  return PasseDTOClass.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): PasseDTOClass[] {
  const list: PasseDTOClass[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
