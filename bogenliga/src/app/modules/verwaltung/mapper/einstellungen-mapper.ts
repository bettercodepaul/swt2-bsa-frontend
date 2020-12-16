import {VersionedDataTransferObject} from '../../shared/data-provider';
import {EinstellungenDTO} from '../types/datatransfer/einstellungen-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): EinstellungenDTO {
  return EinstellungenDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): EinstellungenDTO[] {
  const list: EinstellungenDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
