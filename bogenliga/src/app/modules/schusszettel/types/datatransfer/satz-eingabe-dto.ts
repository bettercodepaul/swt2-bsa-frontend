/**
 * Einzelne Satzdaten eines Schützen für die SATZEINGABE-POST.
 * Updated to match backend ARROWS_PER_SHOOTER = 2
 */
export interface SchuetzenSatzDTO {
  /** ID des Schützen */
  schuetzenId: number;
  /** Punkte des ersten Schusses */
  schuss1: number;
  /** Punkte des zweiten Schusses */
  schuss2: number;
  // Removed schuss3 to match backend ARROWS_PER_SHOOTER = 2
}

/**
 * Wrapper für die POST-Anfrage vom Typ SATZEINGABE.
 */
export interface SatzEingabeDTO {
  /** Die Liste aller SchuetzenSatzDTOs */
  satzeingabe: SchuetzenSatzDTO[];
}
