import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DisziplinDTO} from '../types/datatransfer/disziplin-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): DisziplinDTO {
  return DisziplinDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): DisziplinDTO[] {
  const list: DisziplinDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
