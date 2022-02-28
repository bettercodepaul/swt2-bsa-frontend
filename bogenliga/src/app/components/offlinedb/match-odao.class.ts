/* This is a 'physical' class that is mapped to
 * the ligatabelle table. We can have methods on it that
 * we could call on retrieved database objects.
 *
 * The Table Liagtabelle is not to be synced to backend
 *  Modifications will be droped, as Backend Table Ligatabelle is a db-view only
 */

import {Omatch} from './types/omatch.interface';
import {db} from '../../modules/shared/data-provider/offlinedb/offlinedb';


export class MatchOdaoClass implements Omatch {
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

  constructor( id: number, version: number, matchVersion: number,
               wettkampfId: number, matchNr: number, matchScheibennummer: number,
               mannschaftId: number, mannschaftName: string, nameGegner: string,
               scheibennummerGegner: number, matchIdGegner: number, naechsteMatchId: number,
               naechsteNaechsteMatchNrMatchId: number, strafpunkteSatz1: number,
               strafpunkteSatz2: number, strafpunkteSatz3: number, strafpunkteSatz4: number,
               strafpunkteSatz5: number) {
    this.id = id;
    this.version = version;

    this.matchVersion = matchVersion;
    this.wettkampfId = wettkampfId;
    this.matchNr = matchNr;
    this.matchScheibennummer = matchScheibennummer;
    this.mannschaftId = mannschaftId;
    this.mannschaftName = mannschaftName;
    this.nameGegner = nameGegner;
    this.scheibennummerGegner = scheibennummerGegner;
    this.matchIdGegner = matchIdGegner;
    this.naechsteMatchId = naechsteMatchId;
    this.naechsteNaechsteMatchNrMatchId = naechsteNaechsteMatchNrMatchId;
    this.strafpunkteSatz1 = strafpunkteSatz1;
    this.strafpunkteSatz2 = strafpunkteSatz2;
    this.strafpunkteSatz3 = strafpunkteSatz3;
    this.strafpunkteSatz4 = strafpunkteSatz4;
    this.strafpunkteSatz5 = strafpunkteSatz5;
  }

  save() {
    return db.transaction('rw', db.matchTabelle, () => {
      db.matchTabelle.put(new MatchOdaoClass(this.id, this.version, this.matchVersion, this.wettkampfId,
        this.matchNr, this.matchScheibennummer, this.mannschaftId, this.mannschaftName,
        this.nameGegner, this.scheibennummerGegner, this.matchIdGegner, this.naechsteMatchId,
        this.naechsteNaechsteMatchNrMatchId, this.strafpunkteSatz1, this.strafpunkteSatz2,
        this.strafpunkteSatz3, this.strafpunkteSatz4, this.strafpunkteSatz5));
    });
  }
}
