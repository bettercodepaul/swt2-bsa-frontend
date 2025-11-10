import {Injectable} from '@angular/core';
import {environment} from '@environment';

/**
 * AnalyticsService
 *
 * Schlanker Wrapper für Tracking-Events und Performance-Messungen (Performance API).
 * - Einheitliche API: track(event, payload?)
 * - Fallback: Console/No-Op (per ENV konfigurierbar)
 * - Optionales P95-Tracking clientseitig (Approximation aus Gleitfenster)
 *
 * Events (Ticket-Scope Ligaübersicht):
 * - nav_ligauebersicht_click
 * - tree_expand
 * - tree_select
 * - api_liga_hierarchie_timing
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private enabled = !!environment?.analytics?.enabled;
  private transport: 'console' | 'auto' = environment?.analytics?.transport ?? 'console';

  private timings: Record<string, number[]> = {};
  private readonly ns = 'bla';

  /**
   * Trackt ein beliebiges Event mit optionalem Payload.
   */
  track(event: string, payload?: any): void {
    if (!this.enabled) { return; }

    const paq = (typeof window !== 'undefined') ? (window as any)._paq : undefined;
    if (this.transport === 'auto' && Array.isArray(paq)) {
      const name = payload != null ? JSON.stringify(payload) : undefined;
      try {
        paq.push(['trackEvent', 'App', event, name]);
      } catch {
        // ignore transport errors
      }
      return;
    }

    // Console-Fallback (Dev/Offline)
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, payload ?? {});
  }

  /** Setzt eine Performance-Markierung. */
  mark(markName: string): void {
    if (!this.enabled || typeof performance === 'undefined' || !performance.mark) { return; }
    try { performance.mark(this.q(markName)); } catch { /* ignore */ }
  }

  /**
   * Misst Zeit zwischen zwei Marks und sendet das Ergebnis als Event.
   * Ergänzt p95 der letzten ~200 Messungen.
   */
  measureAndTrack(event: string, startMark: string, endMark: string, payload?: Record<string, any>): void {
    const duration = this.measure(startMark, endMark);
    if (duration == null) { return; }

    const enriched: Record<string, any> = { ...(payload || {}), durationMs: Math.round(duration) };
    const p95 = this.updateAndGetP95(event, duration);
    if (p95 != null) { enriched.p95Ms = Math.round(p95); }

    this.track(event, enriched);
  }

  private measure(startMark: string, endMark: string): number | null {
    if (typeof performance === 'undefined' || !performance.measure) { return null; }
    const start = this.q(startMark); const end = this.q(endMark);
    try {
      performance.mark(end);
      const measureName = this.q(`${startMark}__to__${endMark}`);
      performance.measure(measureName, start, end);
      const entries = performance.getEntriesByName(measureName);
      const last = entries[entries.length - 1];
      return last?.duration ?? null;
    } catch { return null; }
  }

  private updateAndGetP95(key: string, valueMs: number): number | null {
    const arr = (this.timings[key] = this.timings[key] || []);
    arr.push(valueMs);
    if (arr.length > 200) { arr.splice(0, arr.length - 200); }
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.floor(0.95 * (sorted.length - 1));
    const p95 = sorted[idx] ?? null;
    if (p95 != null) {
      // eslint-disable-next-line no-console
      console.debug(`[analytics] p95(${key})=${Math.round(p95)}ms (n=${sorted.length})`);
    }
    return p95;
  }

  private q(name: string): string { return `${this.ns}:${name}`; }
}
