import {VersionedDataTransferObject} from '../../shared/data-provider';
import {MannschaftDTO} from '../types/datatransfer/mannschaft-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): MannschaftDTO {
  return MannschaftDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MannschaftDTO[] {
  const list: MannschaftDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
