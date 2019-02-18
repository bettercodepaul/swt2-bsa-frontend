import {VersionedDataTransferObject} from '../../shared/data-provider';
import {MannschaftsMitgliedDTO} from '../types/datatransfer/mannschaftsmitglied-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): MannschaftsMitgliedDTO {
  return MannschaftsMitgliedDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MannschaftsMitgliedDTO[] {
  const list: MannschaftsMitgliedDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
