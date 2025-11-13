import { UrlSegment, UrlMatchResult } from '@angular/router';

/**
 * Unterstützt Pfade:
 *   home?liga=<id|slug>
 * Gibt den Wert als posParams.liga zurück.
 */
export function ligaMatcher(expectedPrefix: string) {
  return (segments: UrlSegment[]): UrlMatchResult | null => {
    if (segments.length !== 2) {
      return null;
    }
    const [prefix, ligaSeg] = segments;
    if (prefix.path !== expectedPrefix) {
      return null;
    }
    if (!ligaSeg.path.startsWith('liga=')) {
      return null;
    }
    const value = ligaSeg.path.substring('liga='.length).trim();
    if (!value) {
      return null;
    }
    return {
      consumed: segments,
      posParams: {
        liga: new UrlSegment(value, {})
      }
    };
  };
}
