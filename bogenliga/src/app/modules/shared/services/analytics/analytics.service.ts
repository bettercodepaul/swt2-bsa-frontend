import { Injectable } from '@angular/core';
import { environment } from '@environment';

export type AnalyticsPayload = Record<string, unknown>;

type Provider = 'matomo' | 'console' | 'none';

/**
 * Lightweight Analytics wrapper used by the Ligaübersicht feature.
 *
 * Goals:
 * - Uniform event taxonomy
 * - Safe fallbacks (console/no-op) in dev or when not configured
 * - Simple timing helper with P95 calculation (client-side)
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly enabled: boolean;
  private readonly provider: Provider;

  // Keep recent timings per event for percentile calculation
  private readonly timings: Record<string, number[]> = {};
  private readonly windowRef: any = typeof window !== 'undefined' ? (window as any) : undefined;

  constructor() {
    const cfg: any = (environment as any).analytics || {};
    // Default: disabled in dev, enabled in prod if not specified
    this.enabled = typeof cfg.enabled === 'boolean' ? cfg.enabled : !!environment.production;
    this.provider = (cfg.provider as Provider) || (environment.production ? 'matomo' : 'console');
  }

  /**
   * Track a named event with optional payload.
   *
   * Known events (Ligaübersicht):
   * - nav_ligauebersicht_click
   * - tree_expand
   * - tree_select
   * - api_liga_hierarchie_timing
   */
  track(event: string, payload?: AnalyticsPayload): void {
    if (!this.enabled) {
      return; // no-op when disabled
    }

    try {
      if (this.provider === 'matomo' && this.windowRef?._paq) {
        // Matomo: category 'Ligauebersicht', action = event, name = JSON payload
        this.windowRef._paq.push(['trackEvent', 'Ligauebersicht', event, JSON.stringify(payload || {})]);
      } else if (this.provider === 'console') {
        // Console fallback for dev/local analysis
        // eslint-disable-next-line no-console
        console.info('[Analytics]', event, payload || {});
      }
      // 'none' provider results in no-op
    } catch {
      // swallow errors to never break UX
    }
  }

  /**
   * Start a high-resolution timer; returns a function that stops and returns duration in ms.
   */
  startTimer(_name: string): () => number {
    const start = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    return () => {
      const end = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      return end - start;
    };
  }

  /**
   * Track timing and compute rolling P95 for the given timing event.
   */
  trackTiming(event: string, durationMs: number, extra?: AnalyticsPayload): void {
    if (!Number.isFinite(durationMs)) {
      return;
    }

    const list = (this.timings[event] = this.timings[event] || []);
    list.push(durationMs);
    // keep last 1000 samples to bound memory
    if (list.length > 1000) {
      list.shift();
    }

    const p95 = this.percentile(list, 95);
    const payload = Object.assign({
      durationMs: Math.round(durationMs),
      p95Ms: Math.round(p95),
      samples: list.length
    }, extra || {});

    this.track(event, payload);

    // Always log P95 to console for quick local evaluation
    if (this.provider === 'console' || !this.enabled) {
      // eslint-disable-next-line no-console
      console.info(`[Analytics:P95] ${event} p95=${Math.round(p95)}ms (n=${list.length})`);
    }
  }

  private percentile(arr: number[], p: number): number {
    if (!arr.length) {
      return 0;
    }
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    const clamped = Math.max(0, Math.min(sorted.length - 1, idx));
    return sorted[clamped];
  }
}
