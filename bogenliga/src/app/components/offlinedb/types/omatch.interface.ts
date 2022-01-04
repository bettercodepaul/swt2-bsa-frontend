// Offline Match Tabelle -> Omatch
// index id only available on client
// client side attribute version to monitor offline modifications
// therefor backend attribute version is stored in "matchVersion"

// backend attribute id is stored in "id" - no new data should be added to match table

import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export interface Omatch extends VersionedDataObject {
  id: number; // Backend Primary Key
  version: number; // client side version to identify modifications by version > 1

  matchVersion: number; // backend dataset version
  wettkampfId: number;
  matchNr: number;
  matchScheibennummer: number;
  mannschaftId: number;
  mannschaftName: string;
  nameGegner: string;
  scheibennummerGegner: number;
  matchIdGegner: number;
  naechsteMatchId: number;
  naechsteNaechsteMatchNrMatchId: number;
  strafpunkteSatz1: number;
  strafpunkteSatz2: number;
  strafpunkteSatz3: number;
  strafpunkteSatz4: number;
  strafpunkteSatz5: number;
}
