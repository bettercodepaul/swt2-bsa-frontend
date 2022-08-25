import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {VEREIN_DETAIL_TABLE_CONFIG} from '@verwaltung/components/verein/verein-detail/verein-detail.config';
import {TableRow} from '@shared/components/tables/types/table-row.class';

import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';

import {toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';


@Component
({
  selector: 'bla-teilnemende-manschaften-tabelle',
  templateUrl: './teilnemende-manschaften-tabelle.component.html',
  styleUrls: ['./teilnemende-manschaften-tabelle.component.scss']
})
export class TeilnemendeManschaftenTabelleComponent implements OnInit, OnChanges {

  @Input() veranstaltungsId: number;

  public config_table = VEREIN_DETAIL_TABLE_CONFIG;
  public rows: TableRow[];

  constructor(private mannschaftsdataprovider: DsbMannschaftDataProviderService, private veranstaltungsProvider: VeranstaltungDataProviderService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log('VeranstaltungsID------------:' + this.veranstaltungsId);

    if (this.veranstaltungsId) {
      this.mannschaftsdataprovider.findAllByVeranstaltungsId(this.veranstaltungsId).then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {

        response = this.addTableAttributes(response);
        this.rows = [];
        this.rows = toTableRows(response.payload);
      });

    } else {
      this.rows = [];
    }
  }

  private addTableAttributes(mannschaften: BogenligaResponse<DsbMannschaftDTO[]>) {

    let name: string;
    mannschaften.payload.forEach((mannschaft) => {
      name = mannschaft.name.substring(0, mannschaft.name.length - 1);
      mannschaft.name = name + ' ' + mannschaft.nummer + '.Mannschaft';
    });
    return mannschaften;

  }

}
