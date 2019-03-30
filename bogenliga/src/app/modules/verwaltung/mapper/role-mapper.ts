import {VersionedDataTransferObject} from '../../shared/data-provider';
import {BenutzerDTO} from '../types/datatransfer/benutzer-dto.class';
import {RoleDTO} from '../types/datatransfer/role-dto.class';


// export function toDO(roleDTO: RoleDTO): RoleDO {
//
// }
//
// export function toDTO(roleDO: RoleDO): RoleDTO {
//
// }


export function toPayload(payload: VersionedDataTransferObject): RoleDTO {
  return RoleDTO.copyFrom(payload);
}

export function fromPayload(payload: VersionedDataTransferObject): RoleDTO {
  return RoleDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): RoleDTO[] {
  const list: RoleDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

