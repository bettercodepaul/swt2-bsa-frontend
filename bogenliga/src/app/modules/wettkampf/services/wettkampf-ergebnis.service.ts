import {LigatabelleErgebnisDO} from '../types/wettkampf-ergebnis-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {WettkampfDataProviderService} from './wettkampf-data-provider.service';
import {Injectable} from '@angular/core';
import {TableRow} from '@shared/components/tables/types/table-row.class';


@Injectable({
  providedIn: 'root'
})
export class WettkampfErgebnisService {
  // Input
  public veranstaltung: VeranstaltungDO;

  // Output
  public ligatabelle: LigatabelleErgebnisDO[] = [];
  public rows: TableRow[];

  private loading = false;

  constructor(private ligatabelleDataProvider: WettkampfDataProviderService) {

  }



}


