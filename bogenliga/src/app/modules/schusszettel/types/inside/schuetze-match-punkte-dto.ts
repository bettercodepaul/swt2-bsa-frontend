/**
 * Repräsentiert einen Schützen und seine bisherige Punktzahl im laufenden Match.
 */
export interface SchuetzeMatchPunkteDTO {
  /** ID des Schützen */
  schuetzenId: number;
  /** bisher erreichte Punkte */
  punkteBisher: number;
}
