import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';
import {VeranstaltungDO} from '@vereine/types/veranstaltung-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {LigatabelleDataProviderService} from './ligatabelle-data-provider.service';
import {Injectable} from '@angular/core';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '@shared/components/tables';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


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


