export interface OfflineWettkampf {
  id?: number; // Primary Key autoincrement
  version?: number;

  wettkampfVeranstaltungsId: number;
  wettkampfDatum: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;
  wettkampfAusrichter: number;
  wettkampfStrasse: string;
  wettkampfPlz: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;


}
