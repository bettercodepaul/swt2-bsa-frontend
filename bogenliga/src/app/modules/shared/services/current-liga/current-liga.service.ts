import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';

/**
 * localStorage Keys für den Liga-Kontext.
 * - ID wird bevorzugt gespeichert, um einen stabilen Lookup zu ermöglichen.
 * - Optional: Slug (falls Deeplink über String erfolgt), um Restore zu ermöglichen, wenn keine ID vorliegt.
 */
const STORAGE_ID_KEY = 'bogenliga_current_liga_id';
const STORAGE_SLUG_KEY = 'bogenliga_current_liga_slug';

/**
 * Repräsentiert den UI-relevanten Zustand des aktuellen Liga-Kontexts.
 * - liga: aktuell gesetzte Liga oder null
 * - loading: true während (Re-)Ladevorgängen (z. B. beim Restore)
 * - error: optionale Fehlernachricht für UI/Logging
 */
export interface CurrentLigaState {
  liga: LigaDO | null;
  loading: boolean;
  error?: string;
}

/**
 * CurrentLigaService
 *
 * Verantwortlichkeiten:
 * - Hält den aktuell gesetzten Liga-Kontext als Observable-State.
 * - Persistiert Auswahl in localStorage (ID + optional Slug) und stellt Restore bereit.
 * - Bietet Komfort-APIs zum Setzen per ID oder Slug (inkl. Caching der zuletzt geladenen ID).
 * - Signalisiert über ready$, wann ein Restore-Versuch abgeschlossen ist (wichtig für App-Initialisierung).
 *
 * Hinweise:
 * - Der Service ist SSR-safe: localStorage-Zugriffe erfolgen nur im Browser.
 * - Verwende state$ zur UI-Anbindung (Skeletons, Fehlermeldungen).
 * - getCurrentLiga() bietet synchronen Zugriff für Guards/Resolver, wenn nötig.
 */
@Injectable({ providedIn: 'root' })
export class CurrentLigaService {
  private stateSubject = new BehaviorSubject<CurrentLigaState>({ liga: null, loading: true });
  /** Observable für den aktuellen Liga-State (UI-Bindings) */
  public state$ = this.stateSubject.asObservable();

  private readySubject = new ReplaySubject<boolean>(1);
  /**
   * Emittiert genau einmal, sobald der initiale Restore-Vorgang (aus localStorage) abgeschlossen ist
   * – unabhängig davon, ob erfolgreich oder nicht. Komponenten können so auf "Bereit" warten.
   */
  public ready$ = this.readySubject.asObservable();

  /** Zuletzt geladene Liga-ID, um unnötige Netzaufrufe zu vermeiden */
  private lastIdLoaded?: number;

  /** true, wenn Ausführung im Browser (nicht SSR) stattfindet */
  private browser: boolean;

  /**
   * Konstruktor
   * - erkennt Browser-Umgebung
   * - triggert initialen Restore aus localStorage (asynchron)
   */
  constructor(
    private ligaProvider: LigaDataProviderService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.browser = isPlatformBrowser(platformId);
    this.restoreFromStorage();
  }

  /**
   * Liefert synchron die aktuell gesetzte Liga (oder null).
   * Eignet sich z. B. für Guards/Resolver, die nicht auf state$ subscriben wollen.
   */
  getCurrentLiga(): LigaDO | null {
    return this.stateSubject.value.liga;
  }

  /**
   * Setzt die aktuelle Liga anhand der numerischen ID.
   * - Verwendet internes Caching (lastIdLoaded), um doppelte Requests zu vermeiden.
   * - Aktualisiert State (loading -> false) und persistiert ID/Slug (falls vorhanden).
   * @param id numerische Liga-ID
   * @returns Promise mit dem geladenen LigaDO
   * @throws Reicht Fehler des DataProviders weiter (z. B. bei Netzwerkproblemen)
   */
  async setLigaById(id: number): Promise<LigaDO> {
    if (this.lastIdLoaded === id && this.stateSubject.value.liga) {
      return this.stateSubject.value.liga;
    }
    this.patch({ loading: true, error: undefined });
    const resp = await this.ligaProvider.findById(id);
    const liga = resp.payload;
    // Hinweis: slug/name-Quelle ggf. an euer Datenmodell anpassen
    this.setLiga(liga, liga?.id, liga?.name);
    return liga;
  }

  /**
   * Setzt die aktuelle Liga anhand eines Slugs/Names (String).
   * - Verwendet den neuen DataProvider-Aufruf findBySlug (Backend: checkExistsLigaName).
   * - Aktualisiert State und persistiert ID + Slug.
   * @param slug slug oder liganame
   * @returns Promise mit dem geladenen LigaDO
   */
  async setLigaBySlug(slug: string): Promise<LigaDO> {
    this.patch({ loading: true, error: undefined });
    const resp = await this.ligaProvider.findBySlug(slug);
    const liga = resp.payload;
    this.setLiga(liga, liga?.id, slug);
    return liga;
  }

  /**
   * Löscht die aktuelle Liga aus dem State und entfernt Persistenz (ID + Slug) aus localStorage.
   * Sinnvoll z. B. beim Logout oder wenn eine ungültige Liga erkannt wurde.
   */
  clear(): void {
    this.setLiga(null, undefined, undefined);
  }

  /**
   * Interne Helper-Methode zum Aktualisieren des States und der Persistenz.
   * - Setzt lastIdLoaded für einfaches Caching.
   * - Persistiert nur im Browser.
   */
  private setLiga(liga: LigaDO | null, id?: number, slug?: string): void {
    this.lastIdLoaded = liga?.id;
    this.patch({ liga, loading: false, error: undefined });
    if (!this.browser) { return; }
    if (liga && id != null) {
      localStorage.setItem(STORAGE_ID_KEY, String(id));
      if (slug) {
        localStorage.setItem(STORAGE_SLUG_KEY, slug);
      }
    } else {
      localStorage.removeItem(STORAGE_ID_KEY);
      localStorage.removeItem(STORAGE_SLUG_KEY);
    }
  }

  /**
   * Versucht beim App-Start, eine zuvor gesetzte Liga aus localStorage wiederherzustellen.
   * - Bevorzugt ID (stabiler Lookup); fällt auf Slug zurück, falls keine ID vorhanden ist.
   * - Ist SSR-safe: im Server-Kontext werden keine Storage-Zugriffe durchgeführt.
   * - Setzt loading=false und signalisiert über ready$, dass der Startzustand feststeht.
   */
  private async restoreFromStorage(): Promise<void> {
    if (!this.browser) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }
    const idRaw = localStorage.getItem(STORAGE_ID_KEY);
    const slugRaw = localStorage.getItem(STORAGE_SLUG_KEY);
    if (!idRaw && !slugRaw) {
      this.patch({ loading: false });
      this.readySubject.next(true);
      return;
    }
    try {
      if (idRaw) {
        await this.setLigaById(Number(idRaw));
      } else if (slugRaw) {
        await this.setLigaBySlug(slugRaw);
      }
    } catch (e) {
      // Fehler beim Restore (z. B. 404, Netzwerk) -> Clean Slate
      this.clear();
      this.patch({ error: 'Restore failed', loading: false });
    } finally {
      this.readySubject.next(true);
    }
  }

  /**
   * Kleines State-Patch-Utility: führt shallow-merge auf den aktuellen State aus.
   * @param partial Teilzustand, der in den bestehenden State gemerged wird
   */
  private patch(partial: Partial<CurrentLigaState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...partial });
  }
}
