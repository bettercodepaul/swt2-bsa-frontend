export interface OfflineWettkampf {
  id?: number; // Primary Key autoincrement
  version?: number;


  veranstaltungId: number;
  datum: string;
  beginn: string;
  tag: string;
  disziplinId: number;
  wettkampftypId: number;
  ausrichter: string;
  strasse: string;
  plz: string;
  ortsname: string;
  ortsinfo: string;
  offlinetoken: string;


}
