export interface OfflineVeranstaltung {
  offlineVersion: number;
  // backend data below
  version?: number;
  id?: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterId: number;
  ligaId: number;
  phase: string;

  groesse: number;
}
