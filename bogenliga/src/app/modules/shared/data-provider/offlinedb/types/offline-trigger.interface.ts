export interface OfflineTrigger {
  id?: number;
  kategorie?: string;
  altsystemId?: number;
  operation?: string;
  status?: string;
  nachricht?: string;
  createdAtUtc?: string
  runAtUtc?: string;
}
