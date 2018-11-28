import {VersionedDataTransferObject} from '../../shared/data-provider';
import {RegionDTO} from '../types/datatransfer/region-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): RegionDTO {
  return RegionDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): RegionDTO[] {
  const list: RegionDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
