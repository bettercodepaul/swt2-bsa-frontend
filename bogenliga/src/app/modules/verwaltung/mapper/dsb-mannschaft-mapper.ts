import {DsbMannschaftDTO} from '../types/datatransfer/dsb-mannschaft-dto.class';
import {VersionedDataTransferObject} from '../../shared/data-provider';

// export function toDO(mannschaftDTO: MannschaftDTO): MannschaftDO {
//
// }
//
// export function toDTO(mannschaftDO: MannschaftDO): MannschaftDTO {
//
// }

export function fromPayload(payload: VersionedDataTransferObject): DsbMannschaftDTO {
  return DsbMannschaftDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): DsbMannschaftDTO[] {
  const list: DsbMannschaftDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
