import {VersionedDataTransferObject} from '../../shared/data-provider';
import {WettkampfKlasseDTO} from '../types/datatransfer/wettkampfklasse-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): WettkampfKlasseDTO {
  return WettkampfKlasseDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): WettkampfKlasseDTO[] {
  const list: WettkampfKlasseDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  console.log(list);
  return list;
}
