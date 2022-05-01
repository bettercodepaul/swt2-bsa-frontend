export interface OfflineMannschaft {
  id?: number; // Primary Key autoincrement
  version?: number;

  vereinId: number;
  nummer: number;
  benutzerId: number;
  veranstaltungId: number;
  sortierung: number;
}
