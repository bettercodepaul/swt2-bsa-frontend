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
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';


@Component({
  selector:    'bla-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})
export class HomeComponent extends CommonComponent implements OnInit {

  public config = HOME_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public wettkaempfe:WettkampfDO[];
  public loadingWettkampf = true;
  public loadingTable = false;
  public rows: TableRow[];
  private tableContent: Array<WettkampfTableDo> = [];

  constructor(private wettkampfDataProvider: WettkampfDataProviderService, vereinDataProvider: VereinDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadWettkaempfe();

  };
    //backend call to get list
  private loadWettkaempfe(): void {
      this.wettkaempfe = [];
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDTO[]>) => {this.wettkaempfe = response.payload;  this.loadingWettkampf = false; })
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => {this.wettkaempfe = response.payload; });
  }


}

