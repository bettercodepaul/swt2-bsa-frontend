import {DataTransferObject, VersionedDataTransferObject} from '../../shared/data-provider';
import {TriggerDTO} from '../types/datatransfer/trigger-dto.class';
import {TriggerCountDTO} from '@verwaltung/types/datatransfer/trigger-count-dto-class';

export function fromPayload(payload: VersionedDataTransferObject): TriggerDTO {
  return TriggerDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): TriggerDTO[] {
  const list: TriggerDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function fromCountPayload(payload:DataTransferObject):TriggerCountDTO{
  return TriggerCountDTO.copyFrom(payload);
}
