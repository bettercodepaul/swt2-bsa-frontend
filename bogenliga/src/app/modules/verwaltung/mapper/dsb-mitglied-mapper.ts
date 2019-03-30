import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DsbMitgliedDTO} from '../types/datatransfer/dsb-mitglied-dto.class';

// export function toDO(dsbMitgliedDTO: DsbMitgliedDTO): DsbMitgliedDO {
//
// }
//
// export function toDTO(dsbMitgliedDO: DsbMitgliedDO): DsbMitgliedDTO {
//
// }

export function fromPayload(payload: VersionedDataTransferObject): DsbMitgliedDTO {
  return DsbMitgliedDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): DsbMitgliedDTO[] {
  const list: DsbMitgliedDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
