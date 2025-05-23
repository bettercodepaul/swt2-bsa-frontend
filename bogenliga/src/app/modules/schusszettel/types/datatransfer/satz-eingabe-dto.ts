/**
 * Einzelne Satzdaten eines Schützen für die SATZEINGABE-POST.
 */
export interface SchuetzenSatzDTO {
  /** ID des Schützen */
  schuetzenId: number;
  /** Punkte des ersten Schusses */
  schuss1: number;
  /** Punkte des zweiten Schusses */
  schuss2: number;
  /** Punkte des dritten Schusses */
  schuss3: number;
}

/**
 * Wrapper für die POST-Anfrage vom Typ SATZEINGABE.
 */
export interface SatzEingabeDTO {
  /** Die Liste aller SchuetzenSatzDTOs */
  satzeingabe: SchuetzenSatzDTO[];
}
