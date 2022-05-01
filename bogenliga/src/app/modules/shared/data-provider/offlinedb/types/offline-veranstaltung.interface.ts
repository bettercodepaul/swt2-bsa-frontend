export interface OfflineVeranstaltung {
  id?: number;
  version?: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterId: number;
  ligaId: number;
}
