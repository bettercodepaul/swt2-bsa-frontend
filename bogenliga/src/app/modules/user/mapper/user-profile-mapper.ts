import {UserProfileDTO} from '../types/datatransfer/user-profile-dto.class';
import {VersionedDataTransferObject} from '../../shared/data-provider';

export function fromPayload(payload: VersionedDataTransferObject): UserProfileDTO {
  return UserProfileDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): UserProfileDTO[] {
  const list: UserProfileDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
