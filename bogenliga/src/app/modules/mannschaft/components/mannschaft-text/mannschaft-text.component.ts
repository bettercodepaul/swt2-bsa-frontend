import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  WETTKAMPF_TABLE_EINZELGESAMT_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzelGesamt.config';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {SchuetzenstatistikDataProviderService} from '@wettkampf/services/schuetzenstatistik-data-provider-service';
import {
  SchuetzenstatistikMatchDataProviderService
} from '@wettkampf/services/schuetzenstatistikmatch-data-provider-service';
import {
  SchuetzenstatistikwettkampftageDataProviderService
} from '@wettkampf/services/schuetzenstatistikwettkampftage-data-provider-service';
import {
  SchuetzenstatistikletztejahreDataProviderService
} from '@wettkampf/services/schuetzenstatistikletztejahre-data-provider-service';
import {LigatabelleDataProviderService} from '../../../ligatabelle/services/ligatabelle-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {WETTKAMPF_TABLE_EINZEL_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzel.config';
import {BogenligaResponse} from '@shared/data-provider';
import {SchuetzenstatistikDO} from '@verwaltung/types/schuetzenstatistik-do.class';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';

@Component({
  selector: 'bla-mannschaft-text',
  templateUrl: './mannschaft-text.component.html',
  styleUrls: ['./mannschaft-text.component.scss']
})
export class MannschaftTextComponent extends CommonComponentDirective implements OnInit, OnChanges {
  @Input() wettkaempfe: WettkampfDTO[];
  @Input() selectedMannschaft: DsbMannschaftDTO;

  public currentConfig = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public loadingData = false;
  public currentWettkampftag = 0;
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public selectedWettkampfTag: WettkampfDTO;
  public loading: false;

  constructor(private schuetzenstatistikDataProvider: SchuetzenstatistikDataProviderService,
              private schuetzenstatistikMatchDataProvider: SchuetzenstatistikMatchDataProviderService,
              private schuetzenstatistikWettkampftageDataProvider: SchuetzenstatistikwettkampftageDataProviderService,
              private schuetzenstatistikLetzteJahreDataProvider: SchuetzenstatistikletztejahreDataProviderService,
              private ligaTabelleDataProvider: LigatabelleDataProviderService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService) {
    super();
  }

  ngOnInit() {
    // this.loadEinzelstatistik(this.selectedMannschaft);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMannschaft']) {
      this.loadEinzelstatistik(this.selectedMannschaft);
    }
    if (changes['wettkaempfe']) {
      this.loadEinzelstatistik(this.selectedMannschaft);
    }
  }

  public onSelectWettkampfTag() {
    console.log('wechsel');
    // TODO: preselect latest Wettkampftag
    // TODO: reload data for selected Wettkampftag
  }

  public async loadEinzelstatistik(selectedMannschaft: DsbMannschaftDO) {
    if ( !this.selectedMannschaft || !this.wettkaempfe) {
      return;
    }
    this.loadingData = true;
    this.currentConfig = WETTKAMPF_TABLE_EINZEL_CONFIG;
    this.rows = [];
    await this.loadSchuetzenstatistiken(selectedMannschaft.vereinId, 0);
    this.loadingData = false;
  }

  private async loadSchuetzenstatistiken(vereinId, index) {
    await this.schuetzenstatistikDataProvider.getSchuetzenstatistikWettkampf(vereinId, this.wettkaempfe[index].id) // TODO: change to selected wettkampf
  .then((response: BogenligaResponse<SchuetzenstatistikDO[]>) => this.handleLoadSchuetzenstatistikSuccess(response.payload));
    if (index < this.wettkaempfe.length - 1) {
      index += 1;
      return this.loadSchuetzenstatistiken(vereinId, index);
    }
  }

  private handleLoadSchuetzenstatistikSuccess(payload) {
    if (payload.length > 0) {
      const formattedRows = this.formatStatistik(toTableRows(payload));
      this.rows.push(formattedRows);
    }
  }

  /**
   * Formats the Schuetzenstatistiken (=> German browser settings => 9,25 instead of 9.25
   * In addition is transforming 'schuetzeSatz1-5' into a more readable format
   */
  private formatStatistik(statistikRow: TableRow[]): TableRow[] {
    statistikRow.forEach((row) => {
      for (const columnKey in row.payload ) {
        // formats numbers into country-dependent format
        if (typeof row.payload[columnKey] === 'number' && row.payload[columnKey] != null) {
          row.payload[columnKey] = row.payload[columnKey].toLocaleString();
          // transforms saetze into a more readable format
        } else if (columnKey.startsWith('schuetzeSatz') && row.payload[columnKey] != null) {
          row.payload[columnKey] = row.payload[columnKey].replace(',', '\\');
        }
      }
    });
    return statistikRow;
  }
}

