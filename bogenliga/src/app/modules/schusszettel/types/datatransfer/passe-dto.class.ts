import {DataTransferObject} from '@shared/data-provider';

export class PasseDTO implements DataTransferObject {
  id: number;

  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdnr: number;
  dsbMitgliedId: number;

  ringzahlPfeil1: number;
  ringzahlPfeil2: number;
  ringzahlPfeil3: number;
  ringzahlPfeil4: number;
  ringzahlPfeil5: number;
  ringzahlPfeil6: number;
}
