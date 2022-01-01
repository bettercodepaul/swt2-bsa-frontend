import {Dexie} from 'dexie';
import {Router} from '@angular/router';
import {environment} from '@environment';
import {AppState} from '@shared/redux-store';
import {CurrentUserService} from '@shared/services';
import {LigasyncpasseDtoClass} from './types/datatransfer/ligasyncpasse-dto.class';
import {LigasyncmannschaftsmitgliedDtoClass} from './types/datatransfer/ligasyncmannschaftsmitglied-dto.class';
import {LigasyncmatchDtoClass} from './types/datatransfer/ligasyncmatch-dto.class';
import {LigasyncligatabelleDtoClass} from './types/datatransfer/ligasyncligatabelle-dto.class';
import {Store} from '@ngrx/store';
import {Oligatabelle} from './types/oligatabelle.interface';


export class OfflinedbComponent extends Dexie {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public inProd = environment.production;

  ligatabelle!: Dexie.Table<Oligatabelle, number>;
  match!: Dexie.Table<LigasyncmatchDtoClass, number>;
  passe!: Dexie.Table<LigasyncpasseDtoClass, number>;
  mannschaftsmitglieder!: Dexie.Table<LigasyncmannschaftsmitgliedDtoClass, number>;

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService, private router: Router) {
    super('OfflinedbComponent');
    this.version(1).stores({
      ligatabelle: '++id, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
        'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz'
    });
  }
}
