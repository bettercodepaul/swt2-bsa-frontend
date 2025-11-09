import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { slugifyLigaName } from '@shared/functions/slug-utils';

const STORAGE_ID_KEY   = 'bogenliga_current_liga_id';
const STORAGE_NAME_KEY = 'bogenliga_current_liga_name';
const STORAGE_SLUG_KEY = 'bogenliga_current_liga_slug';

export interface CurrentLigaState {
  liga: LigaDO | null;
  loading: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class CurrentLigaService {
  private stateSubject = new BehaviorSubject<CurrentLigaState>({ liga: null, loading: true });
  public state$ = this.stateSubject.asObservable();

  private readySubject = new ReplaySubject<boolean>(1);
  public ready$ = this.readySubject.asObservable();

  private lastIdLoaded?: number;
  private browser: boolean;

  constructor(
    private ligaProvider: LigaDataProviderService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.browser = isPlatformBrowser(platformId);
    this.restoreFromStorage();
  }

  getCurrentLiga(): LigaDO | null {
    return this.stateSubject.value.liga;
  }

  async setLigaById(id: number): Promise<LigaDO> {
    if (this.lastIdLoaded === id && this.stateSubject.value.liga) {
      return this.stateSubject.value.liga;
    }
    this.patch({ loading: true, error: undefined });
    const resp = await this.ligaProvider.findById(id);
    const liga = resp.payload;
    this.persistAndSet(liga);
    return liga;
  }

  /**
   * Setzt Liga über einen Namen (Backend erwartet den Original-Namen).
   * (Beibehalt für Fälle, in denen nur der Name vorliegt.)
   */
  async setLigaBySlug(name: string): Promise<LigaDO> {
    this.patch({ loading: true, error: undefined });
    const resp = await this.ligaProvider.findBySlug(name);
    const liga = resp.payload;
    this.persistAndSet(liga);
    return liga;
  }

  clear(): void {
    this.setLigaInternal(null);
    if (!this.browser) { return; }
    localStorage.removeItem(STORAGE_ID_KEY);
    localStorage.removeItem(STORAGE_NAME_KEY);
    localStorage.removeItem(STORAGE_SLUG_KEY);
  }

  private persistAndSet(liga: LigaDO | null): void {
    this.setLigaInternal(liga);
    if (!this.browser) { return; }
    if (liga && liga.id != null) {
      const name = liga.name ?? '';
      const slug = slugifyLigaName(name);
      localStorage.setItem(STORAGE_ID_KEY, String(liga.id));
      localStorage.setItem(STORAGE_NAME_KEY, name);
      localStorage.setItem(STORAGE_SLUG_KEY, slug);
    } else {
      localStorage.removeItem(STORAGE_ID_KEY);
      localStorage.removeItem(STORAGE_NAME_KEY);
      localStorage.removeItem(STORAGE_SLUG_KEY);
    }
  }

  private setLigaInternal(liga: LigaDO | null): void {
    this.lastIdLoaded = liga?.id;
    this.patch({ liga, loading: false, error: undefined });
  }

  /**
   * Restore ohne Migration:
   * - Wenn ID vorhanden: per ID laden.
   * - Sonst, wenn NAME vorhanden: per Name laden.
   * - SLUG wird ignoriert (nur informativ gespeichert).
   */
  private async restoreFromStorage(): Promise<void> {
    if (!this.browser) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }

    const idRaw   = localStorage.getItem(STORAGE_ID_KEY);
    const nameRaw = localStorage.getItem(STORAGE_NAME_KEY);

    if (!idRaw && !nameRaw) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }

    try {
      if (idRaw) {
        await this.setLigaById(Number(idRaw));
      } else if (nameRaw) {
        await this.setLigaBySlug(nameRaw);
      }
    } catch {
      this.clear();
      this.patch({ error: 'Restore failed', loading: false });
    } finally {
      this.readySubject.next(true);
    }
  }

  private patch(partial: Partial<CurrentLigaState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...partial });
  }
}
