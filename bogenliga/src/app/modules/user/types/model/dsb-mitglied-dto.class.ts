import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMitgliedDTO implements DataTransferObject {
  id: number;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  nationalitaet: string;
  mitgliedsnummer: string;
  vereinsId: number;
  userId: number;
  version: number;
}
