import {OfflineMatch} from "@shared/data-provider/offlinedb/types/offline-match.interface";
import {OfflinePasse} from "@shared/data-provider/offlinedb/types/offline-passe.interface";
import {
  OfflineMannschaftsmitglied
} from "@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface";
import {
  OfflineDsbMitglied
} from "@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface";
import {
  OfflineMannschaft
} from "@shared/data-provider/offlinedb/types/offline-mannschaft.interface";

export interface OfflinetokenSync {
  offlineToken: string;
  match: OfflineMatch[];
  passe: OfflinePasse[];
  mannschaft: OfflineMannschaft[];
  mannschaftsmitglied: OfflineMannschaftsmitglied[];
  dsbMitglied: OfflineDsbMitglied[];

}
