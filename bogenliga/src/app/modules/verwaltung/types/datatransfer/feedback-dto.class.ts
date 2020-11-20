import {DataTransferObject} from '../../../shared/data-provider';

export class FeedbackDTO implements DataTransferObject {

  id: number;
  version: number;
  feedback: string;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    feedback?: string;

  } = {}): FeedbackDTO {
    const copy = new FeedbackDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.feedback = optional.feedback || '';

    return copy;
  }


}
