/**
 * DTO für Schützeninformationen, die an das Tablet geliefert werden.
 * Wird für die Anzeige der Namen, Rückennummern und IDs verwendet.
 */
export interface SchuetzeStammdatenDTO {
  /** ID des Schützen */
  schuetzenId: number;
  /** Rückennummer des Schützen */
  rueckennummer: number;
  /** Vorname des Schützen */
  vorname: string;
  /** Nachname des Schützen */
  nachname: string;
}
