/**
 * Unit-Tests für League-URL-Helper-Funktionen.
 */

import {buildLeagueUrl, isValidLigaId} from './league-url.helper';

describe('LeagueUrlHelper', () => {
  describe('buildLeagueUrl', () => {
    it('sollte eine gültige URL für eine positive Liga-ID erstellen', () => {
      const url = buildLeagueUrl(123);
      expect(url).toBe('/wettkaempfe/ligatabelle?ligaId=123');
    });

    it('sollte für verschiedene Liga-IDs unterschiedliche URLs erstellen', () => {
      expect(buildLeagueUrl(1)).toBe('/wettkaempfe/ligatabelle?ligaId=1');
      expect(buildLeagueUrl(999)).toBe('/wettkaempfe/ligatabelle?ligaId=999');
      expect(buildLeagueUrl(12345)).toBe('/wettkaempfe/ligatabelle?ligaId=12345');
    });

    it('sollte einen Fehler für null werfen', () => {
      expect(() => buildLeagueUrl(null as any)).toThrowError(/Invalid ligaId/);
    });

    it('sollte einen Fehler für undefined werfen', () => {
      expect(() => buildLeagueUrl(undefined as any)).toThrowError(/Invalid ligaId/);
    });

    it('sollte einen Fehler für negative Zahlen werfen', () => {
      expect(() => buildLeagueUrl(-1)).toThrowError(/Invalid ligaId/);
    });

    it('sollte einen Fehler für 0 werfen', () => {
      expect(() => buildLeagueUrl(0)).toThrowError(/Invalid ligaId/);
    });

    it('sollte einen Fehler für NaN werfen', () => {
      expect(() => buildLeagueUrl(NaN)).toThrowError(/Invalid ligaId/);
    });

    it('sollte einen Fehler für Infinity werfen', () => {
      expect(() => buildLeagueUrl(Infinity)).toThrowError(/Invalid ligaId/);
    });
  });

  describe('isValidLigaId', () => {
    it('sollte true für positive Ganzzahlen zurückgeben', () => {
      expect(isValidLigaId(1)).toBe(true);
      expect(isValidLigaId(123)).toBe(true);
      expect(isValidLigaId(999999)).toBe(true);
    });

    it('sollte true für positive Dezimalzahlen zurückgeben', () => {
      expect(isValidLigaId(1.5)).toBe(true);
      expect(isValidLigaId(123.456)).toBe(true);
    });

    it('sollte false für null zurückgeben', () => {
      expect(isValidLigaId(null)).toBe(false);
    });

    it('sollte false für undefined zurückgeben', () => {
      expect(isValidLigaId(undefined)).toBe(false);
    });

    it('sollte false für Strings zurückgeben', () => {
      expect(isValidLigaId('123')).toBe(false);
      expect(isValidLigaId('')).toBe(false);
    });

    it('sollte false für negative Zahlen zurückgeben', () => {
      expect(isValidLigaId(-1)).toBe(false);
      expect(isValidLigaId(-123)).toBe(false);
    });

    it('sollte false für 0 zurückgeben', () => {
      expect(isValidLigaId(0)).toBe(false);
    });

    it('sollte false für NaN zurückgeben', () => {
      expect(isValidLigaId(NaN)).toBe(false);
    });

    it('sollte false für Infinity zurückgeben', () => {
      expect(isValidLigaId(Infinity)).toBe(false);
      expect(isValidLigaId(-Infinity)).toBe(false);
    });

    it('sollte false für Objekte zurückgeben', () => {
      expect(isValidLigaId({})).toBe(false);
      expect(isValidLigaId([])).toBe(false);
    });
  });
});
