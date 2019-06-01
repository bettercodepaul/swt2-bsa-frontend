import {Component, OnInit} from '@angular/core';
import {HOME_CONFIG} from './home.config';
import {BogenligaResponse} from '@shared/data-provider';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {CommonComponent, toTableRows} from '@shared/components';
import {WETTKAMPF_TABLE_CONFIG} from '@home/components/home/wettkampf/wettkampf.config';
import {WettkampfTableDo} from '@home/components/home/wettkampf/wettkampfTable-do.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {Wettkaempfe} from '../../../../../../e2e/src/wettkaempfe/wettkaempfe.po';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {VereinDO} from '@vereine/types/verein-do.class';
import {VeranstaltungDataProviderService} from '@vereine/services/veranstaltung-data-provider.service';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';
import {VeranstaltungDTO} from '@vereine/types/datatransfer/veranstaltung-dto.class';


@Component({
  selector:    'bla-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})
export class HomeComponent extends CommonComponent implements OnInit {

  public config = HOME_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public wettkaempfe: WettkampfDO[];
  public loadingWettkampf = true;
  public loadingTable = false;
  public rows: TableRow[];


  constructor(private wettkampfDataProvider: WettkampfDataProviderService, private veranstaltungDataProvider: VeranstaltungDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadWettkaempfe();

  }
    // backend call to get list
  private loadWettkaempfe(): void {
      this.wettkaempfe = [];
      this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDTO[]>) => { this.handleSuccessLoadWettkaempfe(response.payload); })
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => {this.wettkaempfe = response.payload; });
  }

  private handleSuccessLoadWettkaempfe(payload: WettkampfDTO[]): void {
    this.wettkaempfe = payload;
    this.wettkaempfe.forEach((wettkampf) => {this.findLigaNameByVeranstaltungsId(wettkampf); });
    this.fillTableRows();
    this.loadingWettkampf = false;
  }

  private findLigaNameByVeranstaltungsId(wettkampf: WettkampfDTO): void {
    this.veranstaltungDataProvider.findById(wettkampf.wettkampfVeranstaltungsId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => {
          wettkampf.wettkampfLiga = response.payload.name;
        })
        .catch((response: BogenligaResponse<VeranstaltungDTO>) => {
          console.log('LigaName not found')
        })

  }

  private fillTableRows(): void {
    this.rows = [];
    this.rows = toTableRows(this.wettkaempfe);

  }


}

