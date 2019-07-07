import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

// die Struktur der Daten ind der Ligatabelle entspricht den Informationen in der Datenbank
// alle Attribute werden aufgenommen
// die Spalten Matchpunkt und MatchpunkteGegen sowie die gleichen Spalten für Satzpunkte werden
// in der Darstellung zusammengefasst mit einem trennenden Doppelpunkt - daher nur zwei Spalten für vier DB-Spalten

export class LigatabelleErgebnisDO implements VersionedDataObject {
  id: number;
  version: number;

  veranstaltung_id: number;
  wettkampf_tag: number;
  mannschaft_id: number;
  mannschaft_nummer: number;
  tabellenplatz: number;
  matchpkt: number;
  matchpkt_gegen: number;
  satzpkt: number;
  satzpkt_gegen: number;
  verein_id: number;
  verein_name: string;


  ligatabelleSatzpunkte: string;
  ligatabelleMatchpunkte: string;

}
