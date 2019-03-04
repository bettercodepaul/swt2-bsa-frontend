import {MannschaftsmitgliedDTO} from '../types/datatransfer/mannschaftsmitglied-dto.class';
import {VersionedDataTransferObject} from '../../shared/data-provider';

// export function toDO(mannschaftDTO: MannschaftDTO): MannschaftDO {
//
// }
//
// export function toDTO(mannschaftDO: MannschaftDO): MannschaftDTO {
//
// }

export function fromPayload(payload: VersionedDataTransferObject): MannschaftsmitgliedDTO {
  return MannschaftsmitgliedDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MannschaftsmitgliedDTO[] {
  const list: MannschaftsmitgliedDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
