import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class DsbMitgliedDO implements VersionedDataObject {
  id: number;
  version: number;

  vorname: string;
  nachname: string;
  geburtsdatum: string;
  nationalitaet: string;
  mitgliedsnummer: string;
  vereinsId: number;
  vereinsName: string;
  userId: number;
  beitrittsdatum: string;
  kampfrichter = false;
}
