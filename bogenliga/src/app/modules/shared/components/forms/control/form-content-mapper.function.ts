import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {FormContent} from '../types/form-content.class';

export function toFormContent(payload: VersionedDataObject): FormContent {
  return new FormContent({payload});
}
