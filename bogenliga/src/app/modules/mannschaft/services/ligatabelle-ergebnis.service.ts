import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {LigatabelleDataProviderService} from './ligatabelle-data-provider.service';
import {Injectable} from '@angular/core';
import {TableRow} from '@shared/components/tables/types/table-row.class';


@Injectable({
  providedIn: 'root'
})
export class LigatabelleErgebnisService {
  // Input
  public veranstaltung: VeranstaltungDO;

  // Output
  public ligatabelle: LigatabelleErgebnisDO[] = [];
  public rows: TableRow[];

  private loading = false;

  constructor(private ligatabelleDataProvider: LigatabelleDataProviderService) {

  }



}


