/**
 * Helper-Funktion zum Generieren von Liga-URLs.
 *
 * Erstellt URLs für die Navigation zur Liga-Homepage basierend auf einer Liga-ID.
 * Der Base-Path ist zentral konfigurierbar und kann bei Bedarf angepasst werden.
 *
 * @module LeagueUrlHelper
 */

/**
 * Basis-Pfad für Liga-Detail-Seiten.
 * Kann zentral angepasst werden, wenn sich die URL-Struktur ändert.
 */
const LEAGUE_BASE_PATH = '/wettkaempfe/ligatabelle';

/**
 * Erstellt eine vollständige URL zur Liga-Homepage.
 *
 * @param ligaId Die ID der Liga
 * @returns Die vollständige URL zur Liga-Homepage
 *
 * @example
 * ```typescript
 * const url = buildLeagueUrl(123);
 * // Returns: '/wettkaempfe/ligatabelle?ligaId=123'
 * ```
 */
export function buildLeagueUrl(ligaId: number): string {
  if (ligaId == null || !Number.isFinite(ligaId) || ligaId <= 0) {
    throw new Error(`Invalid ligaId: ${ligaId}. Must be a positive finite number.`);
  }
  return `${LEAGUE_BASE_PATH}?ligaId=${ligaId}`;
}

/**
 * Prüft, ob eine Liga-ID gültig ist.
 *
 * @param ligaId Die zu prüfende Liga-ID
 * @returns true, wenn die ID gültig ist, sonst false
 */
export function isValidLigaId(ligaId: any): ligaId is number {
  return typeof ligaId === 'number' && Number.isFinite(ligaId) && ligaId > 0;
}
