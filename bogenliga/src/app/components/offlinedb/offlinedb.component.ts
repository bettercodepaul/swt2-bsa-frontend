import {Dexie} from 'dexie';
import {environment} from '@environment';
import {LigasyncpasseDtoClass} from './types/datatransfer/ligasyncpasse-dto.class';
import {LigasyncmannschaftsmitgliedDtoClass} from './types/datatransfer/ligasyncmannschaftsmitglied-dto.class';
import {Oligatabelle} from './types/oligatabelle.interface';
import {Omatch} from './types/omatch.interface';
import {BogenligaResponse} from '@shared/data-provider';
import {SyncDataProviderService} from './services/sync-provider.service';
import {MatchOdaoClass} from './match-odao.class';
import {LigatabelleOdaoClass} from './ligatabelle-odao.class';


export class OfflinedbComponent extends Dexie {
  public ligatabelle!: Dexie.Table<Oligatabelle, number>;
  public match!: Dexie.Table<Omatch, number>;
  public passe!: Dexie.Table<LigasyncpasseDtoClass, number>;
  public mannschaftsmitglieder!: Dexie.Table<LigasyncmannschaftsmitgliedDtoClass, number>;

  public currentLigatabelle: Oligatabelle[];

  constructor() {

    super('OfflinedbComponent');

    this.version(1).stores({
      ligatabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
        'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz',
      match: '++id, version, matchVersion, wettkampfId, matchNr, matchScheibennummer, mannschaftId,   mannschaftName, '+
        'nameGegner, scheibennummerGegner, matchIdGegner, naechsteMatchId, naechsteNaechsteMatchNrMatchId,'+
        'strafpunkteSatz1, strafpunkteSatz2, strafpunkteSatz3, strafpunkteSatz4, strafpunkteSatz5'
    });

    this.ligatabelle.mapToClass(LigatabelleOdaoClass);
    this.match.mapToClass(MatchOdaoClass);
    // prefill all offline tables

  }
  // beispielhaften Laden der Liagatablle aus dem Backend
  // TODO das gleiche ist beim Instanziieren für die Tabellen match, passe und manschaftsmitglied zu tun
 /*
  private loadOfflineLigatabelle(veranstaltungsId: number) {
    this.syncservice.loadLigatabelleVeranstaltung(veranstaltungsId)
      .then((response: BogenligaResponse<Oligatabelle[]>) => response.payload.length >= 4 ? this.handleloadOfflineLigatabelle(response) : this.handleloadOfflineLigatabelleFailure())
      .catch(() => this.handleloadOfflineLigatabelleFailure());
  }
*/
  private handleloadOfflineLigatabelleFailure() {
    console.log('Could not download Offlinedata for Ligateblle');
    this.currentLigatabelle = undefined;
  }

  private handleloadOfflineLigatabelle(response: BogenligaResponse<Oligatabelle[]>) {
    try {
      this.currentLigatabelle = response.payload;
      this.currentLigatabelle.forEach((currentLigatabelle) => this.ligatabelle.put(currentLigatabelle));
    } catch (error) {
      console.error(error);
    }
  }
}

// sollte zukünftig in der instanziierenden Klasse stehen.
// über db.  zugriff auf die Tabellen
export const db = new OfflinedbComponent();

