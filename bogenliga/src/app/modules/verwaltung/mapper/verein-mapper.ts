import {VersionedDataTransferObject} from '../../shared/data-provider';
import {VereinDTO} from '../types/datatransfer/verein-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): VereinDTO {
  return VereinDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): VereinDTO[] {
  const list: VereinDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  console.log(list);
  return list;
}
