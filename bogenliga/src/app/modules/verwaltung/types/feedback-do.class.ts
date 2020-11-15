import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class FeedbackDO implements VersionedDataObject {
  id: number;
  version: number;
  feedback: string;
}
