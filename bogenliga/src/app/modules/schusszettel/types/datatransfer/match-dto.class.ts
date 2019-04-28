import {DataTransferObject} from '@shared/data-provider';

export class PasseDTO implements DataTransferObject {
  id: number;

  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  begegnung: number;
  scheibennummer: number;

  matchpunkte: number;
  satzpunkte: number;
}
