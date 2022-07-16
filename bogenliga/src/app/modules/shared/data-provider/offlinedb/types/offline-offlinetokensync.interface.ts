import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {
  OfflineDsbMitglied
} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {MatchDTOExt} from '@wkdurchfuehrung/types/datatransfer/match-dto-ext.class';
import {MannschaftsmitgliedDTO} from '@verwaltung/types/datatransfer/mannschaftsmitglied-dto.class';

export interface OfflinetokenSync {
  wettkampfId: number;
  offlineToken: string;
  matchesDTO: MatchDTOExt[];
  mannschaftsmitgliederDTO: MannschaftsmitgliedDTO[];

}
