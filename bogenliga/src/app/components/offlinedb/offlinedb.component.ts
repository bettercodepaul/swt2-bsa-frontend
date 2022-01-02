import {Dexie} from 'dexie';
import {Router} from '@angular/router';
import {environment} from '@environment';
import {AppState} from '@shared/redux-store';
import {CurrentUserService} from '@shared/services';
import {LigasyncpasseDtoClass} from './types/datatransfer/ligasyncpasse-dto.class';
import {LigasyncmannschaftsmitgliedDtoClass} from './types/datatransfer/ligasyncmannschaftsmitglied-dto.class';
import {LigasyncmatchDtoClass} from './types/datatransfer/ligasyncmatch-dto.class';
import {Store} from '@ngrx/store';
import {Oligatabelle} from './types/oligatabelle.interface';
import {BogenligaResponse} from '@shared/data-provider';
import {SyncDataProviderService} from './services/sync-provider.service';


export class OfflinedbComponent extends Dexie {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public inProd = environment.production;

  public ligatabelle!: Dexie.Table<Oligatabelle, number>;
  public match!: Dexie.Table<LigasyncmatchDtoClass, number>;
  public passe!: Dexie.Table<LigasyncpasseDtoClass, number>;
  public mannschaftsmitglieder!: Dexie.Table<LigasyncmannschaftsmitgliedDtoClass, number>;

  public currentLigatabelle: Oligatabelle[];

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService, private router: Router,
              private syncservice: SyncDataProviderService) {

    super('OfflinedbComponent');
    this.version(1).stores({
      ligatabelle: '++id, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
        'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz'
    });

    // prefill all offline tables

  }

  private loadOfflineLigatabelle(veranstaltungsId: number) {
    this.syncservice.loadLigatabelleVeranstaltung(veranstaltungsId)
      .then((response: BogenligaResponse<Oligatabelle[]>) => response.payload.length >= 4 ? this.handleloadOfflineLigatabelle(response) : this.handleloadOfflineLigatabelleFailure())
      .catch(() => this.handleloadOfflineLigatabelleFailure());
  }

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
