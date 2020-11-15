import {VersionedDataTransferObject} from '../../shared/data-provider';
import {FeedbackDTO} from '../types/datatransfer/feedback-dto-class';

// export function toDO(FeedbackDTO: FeedbackDTO): FeedbackDO {
//
// }
//
// export function toDTO(dsbMitgliedDO: DsbMitgliedDO): DsbMitgliedDTO {
//
// }

export function fromPayload(payload: VersionedDataTransferObject): FeedbackDTO {
  return FeedbackDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): FeedbackDTO[] {
  const list: FeedbackDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
