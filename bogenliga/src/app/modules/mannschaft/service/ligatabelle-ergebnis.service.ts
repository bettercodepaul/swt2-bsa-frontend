import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';
import {VeranstaltungDO} from '@vereine/types/veranstaltung-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {LigatabelleDataProviderService} from './ligatabelle-data-provider.service';
import {Injectable} from '@angular/core';
import {TableRow} from "@shared/components/tables/types/table-row.class";
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

  public createErgebnisse(veranstaltung: VeranstaltungDO): LigatabelleErgebnisDO[] {
       this.setupService(veranstaltung);
       return this.ligatabelle;
  }


  // Konstruktor und Initialisierung
  private setupService(veranstaltung: VeranstaltungDO) {
    this.veranstaltung = veranstaltung;
    this.loadAll();
  }


  private createLigatabelle(): LigatabelleErgebnisDO[] {
    this.ligatabelle = [];

    return this.ligatabelle;
  }

  public loadAll() {
    this.loading = true;
    this.loadLiga();
  }

  private loadLiga() {
    this.ligatabelleDataProvider.findAll()
        .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<LigatabelleErgebnisDO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<LigatabelleErgebnisDO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }


}


