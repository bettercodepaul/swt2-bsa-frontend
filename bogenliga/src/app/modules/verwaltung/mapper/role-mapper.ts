import {VersionedDataTransferObject} from '../../shared/data-provider';
import {UserDTO} from '../types/datatransfer/user-dto.class';
import {RoleDTO} from '../types/datatransfer/role-dto.class';
import {UserOverviewGuard} from '@verwaltung/guards';


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

