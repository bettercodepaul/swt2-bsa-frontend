import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CurrentLigaService } from '@shared/services/current-liga';

import { LigaDO } from '@verwaltung/types/liga-do.class';
import { VeranstaltungDO } from '@verwaltung/types/veranstaltung-do.class';
import { WettkampfDO } from '@verwaltung/types/wettkampf-do.class';
import { MatchDO } from '@verwaltung/types/match-do.class';
import { LigatabelleErgebnisDO } from '../../ligatabelle/types/ligatabelle-ergebnis-do.class';

import { VeranstaltungDataProviderService } from '@verwaltung/services/veranstaltung-data-provider.service';
import { WettkampfDataProviderService } from '@verwaltung/services/wettkampf-data-provider.service';
import { MatchDataProviderService as WettkampfMatchDataProviderService } from '@wettkampf/services/match-data-provider.service';
import { LigatabelleDataProviderService } from '../../ligatabelle/services/ligatabelle-data-provider.service';

/**
 * Leichter, globaler Liga-Kontext für alle liga-spezifischen Seiten.
 * Schwere Daten (Tabellen, Matches) ggf. separat per Page-Resolver oder im Component mit Skeletons nachladen.
 */
export interface LigaContext {
  liga: LigaDO;
  veranstaltung: VeranstaltungDO | null;
  wettkaempfe: WettkampfDO[];
  defaultWettkampf: WettkampfDO | null;
}

@Injectable({ providedIn: 'root' })
export class LigaContextResolver implements Resolve<Promise<LigaContext | null>> {

  constructor(
    private currentLiga: CurrentLigaService,
    private veranstaltungProvider: VeranstaltungDataProviderService,
    private wettkampfProvider: WettkampfDataProviderService,
    private matchProvider: WettkampfMatchDataProviderService,
    private ligatabelleProvider: LigatabelleDataProviderService,
    private router: Router
  ) {}

  async resolve(_route: ActivatedRouteSnapshot): Promise<LigaContext | null> {
    try {
      const liga = this.currentLiga.getCurrentLiga();
      if (!liga || liga.id == null) {
        this.router.navigateByUrl('/home');
        return null;
      }

      const nowYear = new Date().getFullYear();
      const veranstAktiv = await this.tryFindVeranstaltungForYear(liga.id, nowYear);
      const veranstFallback = veranstAktiv ?? await this.findNewestVeranstaltung(liga.id);
      const veranstaltung = veranstFallback ?? null;

      const wettkaempfe = veranstaltung
        ? await this.loadWettkaempfe(veranstaltung.id)
        : [];

      const defaultWettkampf = this.pickDefaultWettkampf(new Date(), wettkaempfe);

      return { liga, veranstaltung, wettkaempfe, defaultWettkampf };
    } catch {
      this.router.navigateByUrl('/home');
      return null;
    }
  }

  /**
   * Lädt Wettkämpfe (Wettkampftage) für eine Veranstaltung.
   * Unterstützt beide möglichen Service-Methoden (findByVeranstaltungId / findAllByVeranstaltungId).
   */
  private async loadWettkaempfe(veranstaltungId: number): Promise<WettkampfDO[]> {
    // Bevorzugt: findByVeranstaltungId
    if (typeof (this.wettkampfProvider as any).findByVeranstaltungId === 'function') {
      const resp = await (this.wettkampfProvider as any).findByVeranstaltungId(veranstaltungId);
      // Map DTO->DO ist in eurem Projekt meist schon in fromPayloadArray enthalten;
      // zur Sicherheit casten wir auf WettkampfDO[]
      return (resp?.payload ?? []) as WettkampfDO[];
    }
    // Fallback: findAllByVeranstaltungId (in einigen Komponenten verwendet)
    if (typeof (this.wettkampfProvider as any).findAllByVeranstaltungId === 'function') {
      const resp = await (this.wettkampfProvider as any).findAllByVeranstaltungId(veranstaltungId);
      return (resp?.payload ?? []) as WettkampfDO[];
    }
    // Nichts verfügbar
    return [];
  }

  private async tryFindVeranstaltungForYear(ligaId: number, year: number): Promise<VeranstaltungDO | null> {
    try {
      const resp = await this.veranstaltungProvider.findByLigaIdAndYear(ligaId, year);
      return resp.payload ?? null;
    } catch {
      return null;
    }
  }

  private async findNewestVeranstaltung(ligaId: number): Promise<VeranstaltungDO | null> {
    try {
      const resp = await this.veranstaltungProvider.findLastVeranstaltungById(ligaId);
      if (resp?.payload?.id) return resp.payload;
    } catch {
      // fallback
    }
    try {
      const listResp = await this.veranstaltungProvider.findByLigaId(ligaId);
      const list = (listResp?.payload ?? []) as VeranstaltungDO[];
      if (!list.length) return null;
      list.sort((a, b) => (b?.sportjahr ?? 0) - (a?.sportjahr ?? 0));
      return list[0] ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Default-Tag: exakt heute > neuester vergangener > erster zukünftiger.
   * Greift flexibel auf Datumseigenschaften zu (wettkampfDatum / datum / wettkampfstart / starttime).
   */
  private pickDefaultWettkampf(now: Date, wettkaempfe: WettkampfDO[]): WettkampfDO | null {
    if (!wettkaempfe?.length) return null;

    const toDate = (wk: any): Date => {
      const raw = wk?.wettkampfDatum ?? wk?.datum ?? wk?.wettkampfstart ?? wk?.starttime;
      const d = raw ? new Date(raw) : null;
      return d && !isNaN(d.getTime()) ? d : new Date(0);
    };

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const sorted = [...wettkaempfe].sort((a, b) => toDate(a).getTime() - toDate(b).getTime());
    const today = sorted.find(wk => sameDay(toDate(wk), now));
    if (today) return today;

    const past = sorted.filter(wk => toDate(wk).getTime() < now.getTime());
    if (past.length) return past[past.length - 1];

    return sorted[0] ?? null;
  }
}
