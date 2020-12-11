import {DataTransferObject} from '../../../shared/data-provider';

export class EinstellungenDTO implements DataTransferObject {




  id: number;
  version: number;
  key: string;
  value: string;



  static copyFrom(optional: {
    id?: number;
    version?: number;
    key?: string;
    value?: string;


  } = {}): EinstellungenDTO {
    const copy = new EinstellungenDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.key = optional.key || '';
    copy.value = optional.value || '';

    return copy;
  }


}
