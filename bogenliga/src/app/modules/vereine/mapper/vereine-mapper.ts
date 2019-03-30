import {VersionedDataTransferObject} from '../../shared/data-provider';
import {VereineDTO} from '../types/datatransfer/vereine-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): VereineDTO {
  return VereineDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): VereineDTO[] {
  const list: VereineDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
