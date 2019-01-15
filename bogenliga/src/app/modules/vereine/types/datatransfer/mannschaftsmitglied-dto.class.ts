import {DataTransferObject} from '../../../shared/data-provider';

export class MannschaftsMitgliedDTO implements DataTransferObject {

  mannschaftsId: long;
  dsbMitgliedId: long;
  dsbMitgliedEingesetzt: boolean;
  dsbMitgliedVorname: String;
  dsbMitgliedNachname: String;

  static copyFrom(optional: {

  } = {}): MannschaftsMitgliedDTO {

  }

}
