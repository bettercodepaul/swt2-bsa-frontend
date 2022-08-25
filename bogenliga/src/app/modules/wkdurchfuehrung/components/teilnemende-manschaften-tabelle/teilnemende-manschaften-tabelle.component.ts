import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TEILNEHMENDE_MANNSCHAFT_CONFIG} from '@wkdurchfuehrung/components/teilnemende-manschaften-tabelle/teilnehmende_mannschaft_tabelle.config';
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

  public config_table = TEILNEHMENDE_MANNSCHAFT_CONFIG;
  public rows: TableRow[];
  public loading = false;

  constructor(private mannschaftsdataprovider: DsbMannschaftDataProviderService, private veranstaltungsProvider: VeranstaltungDataProviderService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log('VeranstaltungsID------------:' + this.veranstaltungsId);

    if (this.veranstaltungsId || this.veranstaltungsId === 0) {

      this.loading = true;
      this.mannschaftsdataprovider.findAllByVeranstaltungsId(this.veranstaltungsId).then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {
        response = this.addTableAttributes(response);
        this.rows = [];
        this.rows = toTableRows(response.payload);
        this.loading = false;
      }).catch(() => {
        // TODO Error handling mit angemessener User-benachrichtigung
        console.log('Error Loading Mannschaften');
        this.loading = false;

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
