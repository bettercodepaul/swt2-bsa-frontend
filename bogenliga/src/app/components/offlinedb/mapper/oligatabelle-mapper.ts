
import {VersionedDataTransferObject} from '@shared/data-provider';
import {LigasyncligatabelleDtoClass} from '../types/datatransfer/ligasyncligatabelle-dto.class';
import {Oligatabelle} from '../types/oligatabelle.interface';


export function toDO(ligasyncligatabelleDTO: LigasyncligatabelleDtoClass): Oligatabelle {

  const oligatabelle = new Oligatabelle();

  oligatabelle.id = null;
  oligatabelle.version = 1;

  oligatabelle.veranstaltungId = ligasyncligatabelleDTO.veranstaltungId;
  TODO.. weiter machen
  veranstaltungName: string; // Bezeichnung der Veranstaltung
  wettkampfId: number; // technischer Schlüssel des aktuellen Wettkampftages
  wettkampfTag: number; // Nummer des Wettkampftages i.d.R. <= 4
  mannschaftId: number; // Mannschaft der Liga
  mannschaftName: string; // Bezeichnung der Mannschaft i.D.R. Vereinsname + ein Nummer
  matchpkt: number; // akt. Stand der Matchpunkte der Mannschaft vor Wettkampfbeginn
  matchpktGegen: number; // akt. Stand der Gegen-Matchpunkte der Mannschaft vor Wettkampfbeginn
  satzpkt: number; // akt. Stand der Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktGegen: number; // akt. Stand der Gegen-Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktDifferenz: number; // akt. Stand der Satzpunktedifferenz der Mannschaft vor Wettkampfbeginn
  sortierung: number; // Sortierungskennzeichen zu Liga.Start
  tabellenplatz: number; // Tabellenplatz der Mannschaft vor Wettkampfbeginn

}
