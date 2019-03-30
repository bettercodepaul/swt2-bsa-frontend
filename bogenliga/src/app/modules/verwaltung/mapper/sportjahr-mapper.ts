import {VersionedDataTransferObject} from '../../shared/data-provider';
import {SportjahrDTO} from '../types/datatransfer/sportjahr-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): SportjahrDTO {
  return SportjahrDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): SportjahrDTO[] {
  const list: SportjahrDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
