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


export class OfflinedbComponent extends Dexie {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public inProd = environment.production;

  ligatabelle!: Dexie.Table<ILigatabelle, number>;
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

export interface ILigatabelle {
  id?: number; // Primary Key autoincrement
  veranstaltungId: number; // technischer Schüssel der Veranstaltung (Liga im Jahr)
  veranstaltungName: string; // Bezeichnung der Veranstaltung
  wettkampfId: number; // technischer Schlüssel des aktuellen Wettkampftages
  wettkampfTag: number; // Nummer des Wettkampftages i.d.R. <= 4
  mannschaftId: number; // Mannschaft der Liga
  mannschaftName: string; // Bezeichnung der Mannschaft i.D.R. Vereinsname + ein Nummer
  matchpkt: number; // akt. Stand der Matchpunkte der Mannschaft vor Wettkampfbeginn
  matchpktGegen: number; // akt. Stand der Gegen-Matchpunkte der Mannschaft vor Wettkampfbeginn
  satzpkt: number; // akt. Stand der Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktGegen: number; // akt. Stand der Gegen-Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktDifferenz: number; // akt. Stand der Satzpunktedifferenz der Mannschaft vor Wettkampfbeginn
  sortierung: number; // Sortierungskennzeichen zu Liga.Start
  tabellenplatz: number; // Tabellenplatz der Mannschaft vor Wettkampfbeginn
}
