import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { slugifyLigaName } from '@shared/functions/slug-utils';

/**
 * localStorage Keys für den Liga-Kontext.
 * ID = stabiler Lookup
 * NAME = Original-Liga-Name (wie vom Backend geliefert)
 * SLUG = kanonischer Slug (aus NAME slugified, nur a-z0-9-)
 *
 * Historie:
 * - Frühere Versionen speicherten im "slug"-Key fälschlich den Original-Namen.
 *   Dies wird beim Restore erkannt und migriert.
 */
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

  /**
   * Lädt Liga per ID (primärer Weg) und persistiert ID + NAME + SLUG.
   */
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
   * Legacy: Setzt Liga über einen Namen (nicht einen Slug!).
   * Das Backend-Ende checkExistsLigaName erwartet den ursprünglichen Liganamen.
   * Wenn ihr später echten Slug-Support habt, kann diese Methode angepasst oder entfernt werden.
   */
  async setLigaBySlug(nameOrSlugLegacy: string): Promise<LigaDO> {
    this.patch({ loading: true, error: undefined });
    const resp = await this.ligaProvider.findBySlug(nameOrSlugLegacy);
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

  /**
   * Persistiert Liga + Ableitungen und setzt State.
   */
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

  /**
   * Reiner State-Setter (ohne Persistenz), gemeinsam genutzt.
   */
  private setLigaInternal(liga: LigaDO | null): void {
    this.lastIdLoaded = liga?.id;
    this.patch({ liga, loading: false, error: undefined });
  }

  /**
   * Migration + Restore:
   * Ablauf:
   * 1. Falls ID vorhanden -> darüber restaurieren (kanonisiert automatisch NAME + SLUG).
   * 2. Falls keine ID, aber NAME vorhanden -> versuche setLigaBySlug(NAME).
   * 3. Falls keine ID+NAME, aber "slug" vorhanden:
   *    - Prüfe ob slug "legacy" (enthält unzulässige Slug-Zeichen)
   *      -> behandle als NAME und versuche setLigaBySlug
   *    - sonst kann ohne Backend kein Name rekonstruiert werden (versuche setLigaBySlug(slug) als Fallback).
   */
  private async restoreFromStorage(): Promise<void> {
    if (!this.browser) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }

    const idRaw   = localStorage.getItem(STORAGE_ID_KEY);
    const nameRaw = localStorage.getItem(STORAGE_NAME_KEY);
    const slugRaw = localStorage.getItem(STORAGE_SLUG_KEY);

    // Nichts gespeichert
    if (!idRaw && !nameRaw && !slugRaw) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }

    try {
      if (idRaw) {
        await this.setLigaById(Number(idRaw));
        return;
      }

      if (nameRaw) {
        await this.setLigaBySlug(nameRaw);
        return;
      }

      if (slugRaw) {
        // Prüfen ob slugRaw ein echter slug war oder ein legacy Name.
        const looksLikeRealSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugRaw);
        if (!looksLikeRealSlug) {
          // legacy: im "slug"-Slot liegt eigentlich der Name
          await this.setLigaBySlug(slugRaw);
        } else {
          // Versuch: slugRaw als Name (Backend braucht Original-Name)
          // Falls Backend das nicht mehr findet -> Clear
          try {
            await this.setLigaBySlug(slugRaw);
          } catch {
            this.clear();
          }
        }
      }
    } catch (e) {
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
