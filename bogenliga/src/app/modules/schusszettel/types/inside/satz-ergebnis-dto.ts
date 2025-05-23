/**
 * Stellt das Ergebnis eines Satzes für beide Teams dar.
 */
export interface SatzErgebnisDTO {
  /** Nummer des Satzes */
  satzNr: number;
  /** Punktzahl von Team 1 im Satz */
  team1Punkte: number;
  /** Punktzahl von Team 2 im Satz */
  team2Punkte: number;
}
