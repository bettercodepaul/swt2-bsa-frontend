/**
 * DTO für Wettkampf-Informationen, die an das Tablet geliefert werden.
 * Enthält relevante Wettkampf- und Veranstaltungsdetails für die Anzeige.
 */
export interface WettkampfInfoDTO {
  wettkampfId: number;
  wettkampfTag: number;
  wettkampfDatum: string;
  wettkampfBeginn: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;
  wettkampfStrasse: string;
  wettkampfPlz: string;

  // Veranstaltungsinfo
  veranstaltungId: number;
  veranstaltungName: string;
  veranstaltungSportjahr: number;
  ligaName: string;
  wettkampftypName: string;
}
