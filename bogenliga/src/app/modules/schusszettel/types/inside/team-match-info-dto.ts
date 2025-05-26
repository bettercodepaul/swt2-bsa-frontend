/**
 * Aggregiertes Match-Ergebnis eines Teams, bestehend aus ID, Name und Matchpunkten.
 */
export interface TeamMatchInfoDTO {
  /** ID des Teams */
  teamId: number;
  /** Name des Teams */
  teamName: string;
  /** Erreichte Matchpunkte */
  matchpunkte: number;
}
