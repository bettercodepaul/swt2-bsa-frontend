import {DataTransferObject} from '../../../shared/data-provider';

export class EinstellungenDTO implements DataTransferObject {


  id: number;
  version: number;
  key: string;
  value: string;
  regex: string;

  hidden: boolean;


  static copyFrom(optional: {
    id?: number;
    version?: number;
    key?: string;
    value?: string;
    regex?: string;
    hidden?: boolean;


  } = {}): EinstellungenDTO {
    const copy = new EinstellungenDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.key = optional.key || '';
    copy.value = optional.value || '';
    copy.regex = optional.regex || null;
    copy.hidden = optional.hidden || false;
    return copy;
  }


}
