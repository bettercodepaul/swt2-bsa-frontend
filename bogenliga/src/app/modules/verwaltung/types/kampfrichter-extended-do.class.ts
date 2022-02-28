import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


export class KampfrichterExtendedDO implements VersionedDataObject {
  id: number;
  wettkampfID: number;
  leitend: boolean;
  version: number;
  vorname: string;
  nachname: string;
  email: string;
  vorNachName: string;
}
