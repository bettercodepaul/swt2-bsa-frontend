import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {WETTKAMPF_TABLE_EINZEL_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzel.config';
import {BogenligaResponse} from '@shared/data-provider';
import {SchuetzenstatistikDO} from '@verwaltung/types/schuetzenstatistik-do.class';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {SchuetzenStatistikType} from '../SchuetzenStatisticEnum';
import {
  WETTKAMPF_TABLE_MATCH_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.siebenmatch.config';
import {
  WETTKAMPF_TABLE_SECHS_MATCHES_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.sechsmatch.config';
import {
  WETTKAMPF_TABLE_FUENF_MATCHES_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.fuenfmatch.config';
import {SchuetzenstatistikMatchDO} from '@verwaltung/types/schuetzenstatistikmatch-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {SchuetzenstatistikWettkampftageDO} from '@verwaltung/types/schuetzenstatistikwettkampftage-do.class';
import {
  WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.wettkampftage.config';
import {SchuetzenstatistikLetzteJahreDO} from '@verwaltung/types/schuetzenstatistikletztejahre-do.class';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'bla-mannschaft-table',
  templateUrl: './mannschaft-table.component.html',
  styleUrls: ['./mannschaft-table.component.scss']
})
export class MannschaftTableComponent extends CommonComponentDirective implements OnChanges {

  constructor(private schuetzenstatistikDataProvider: SchuetzenstatistikDataProviderService,
              private schuetzenstatistikMatchDataProvider: SchuetzenstatistikMatchDataProviderService,
              private schuetzenstatistikWettkampftageDataProvider: SchuetzenstatistikwettkampftageDataProviderService,
              private schuetzenstatistikLetzteJahreDataProvider: SchuetzenstatistikletztejahreDataProviderService,
              public translate: TranslatePipe) {
    super();
  }
  @Input() wettkaempfe: WettkampfDTO[];
  @Input() selectedMannschaft: DsbMannschaftDTO;
  @Input() veranstaltung: VeranstaltungDTO;
  @Input() public selectedStatistic: SchuetzenStatistikType;

  public currentConfig = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public loadingData = false;
  public currentWettkampftag = 0;
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public selectedWettkampfTag: WettkampfDTO;
  public loading: false;

  public readonly SchuetzenStatistikType = SchuetzenStatistikType;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMannschaft'] || changes['selectedStatistic']) {
      this.statisticChange();
    }
    if (changes['wettkaempfe']) {
      this.selectedWettkampfTag = this.getLatestWettkampfTag();
      this.currentWettkampftag = this.wettkaempfe?.indexOf(this.selectedWettkampfTag) || 0;

      this.statisticChange();
    }

  }

  public statisticChange() {
    switch (this.selectedStatistic) {
      case SchuetzenStatistikType.EINZELSTATISTIK:
        this.loadEinzelstatistik();
        break;
      case SchuetzenStatistikType.WETTKAMPFTAGESSTATISTIK:
        this.loadSchuetzenstatistikMatch();
        break;
      case SchuetzenStatistikType.WETTKAMPFSTATISTIK:
        this.loadSchuetzenstatistikWettkampftage();
        break;
      case SchuetzenStatistikType.SAISONSTATISTIK:
        this.loadSchuetzenstatistikLetzteJahre();
        break;
    }
  }

  public onSelectWettkampfTag() {
    this.statisticChange();
  }

  public async loadEinzelstatistik() {
    if ( !this.selectedMannschaft || !this.wettkaempfe) {
      return;
    }
    if (this.selectedMannschaft.veranstaltungId === null) {
      this.rows = [];
      return;
    }
    this.loadingData = true;
    this.currentConfig = WETTKAMPF_TABLE_EINZEL_CONFIG;
    this.rows = [];
    await this.loadSchuetzenstatistiken(0);
    this.loadingData = false;
  }

  private async loadSchuetzenstatistikMatch() {
    this.loadingData = true;
    if (this.selectedMannschaft !== undefined && this.selectedMannschaft !== null && this.selectedWettkampfTag?.id ) {
      this.rows = [];
      // make first wettkampftag row visible
      this.currentConfig = WETTKAMPF_TABLE_MATCH_CONFIG;
      await this.loadSchuetzenstatistikenMatch(this.selectedMannschaft.vereinId);
      // if there wasn't a problem with the REST-calls
      if (this.loadingData) {
        // this decides whether a wettkampf had 5, 6 or 7 matches, depending on the count the configuration will be adjusted
        if (this.veranstaltung.groesse === 8) {
          this.currentConfig = WETTKAMPF_TABLE_MATCH_CONFIG;
        } else if (this.veranstaltung.groesse === 4) {
          this.currentConfig = WETTKAMPF_TABLE_SECHS_MATCHES_CONFIG;
        } else {
          this.currentConfig = WETTKAMPF_TABLE_FUENF_MATCHES_CONFIG;
        }
      } else {
        this.rows = [];
      }
    }
    this.loadingData = false;
  }

  public async loadSchuetzenstatistikWettkampftage() {
    if (this.selectedMannschaft !== undefined && this.selectedMannschaft !== null) {
      this.loadingData = true;
      this.rows = [];
      await this.schuetzenstatistikWettkampftageDataProvider.getSchuetzenstatistikWettkampftageVeranstaltung(this.selectedMannschaft.vereinId, this.selectedMannschaft.veranstaltungId)
        .then((response: BogenligaResponse<SchuetzenstatistikWettkampftageDO[]>) => this.handleLoadStatisticSuccess(response.payload));
      this.currentConfig = WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG;
    }
    this.loadingData = false;
  }

  public async loadSchuetzenstatistikLetzteJahre() {
    if (this.selectedMannschaft !== undefined && this.selectedMannschaft !== null) {
      this.loadingData = true;
      this.rows = [];
      const sportjahr = this.veranstaltung.sportjahr;
      await this.schuetzenstatistikLetzteJahreDataProvider.getSchuetzenstatistikLetzteJahre(sportjahr, this.selectedMannschaft.veranstaltungId, this.selectedMannschaft.vereinId)
        .then((response: BogenligaResponse<SchuetzenstatistikLetzteJahreDO[]>) => this.handleLoadStatisticSuccess(response.payload));
      this.currentConfig = {
        actions: {actionTypes: []},
        columns: [
          {
            translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
            propertyName: 'schuetzenname',
            width: 100,
            sortable: true
          },
          {
            translationKey: '⌀ ' + (sportjahr - 4).toString(),
            propertyName: 'sportjahr1',
            width: 40,
          },
          {
            translationKey: '⌀ ' + (sportjahr - 3).toString(),
            propertyName: 'sportjahr2',
            width: 40,
          },
          {
            translationKey: '⌀ ' + (sportjahr - 2).toString(),
            propertyName: 'sportjahr3',
            width: 40,
          },
          {
            translationKey: '⌀ ' + (sportjahr - 1).toString(),
            propertyName: 'sportjahr4',
            width: 40,
          },
          {
            translationKey: '⌀ ' + (sportjahr).toString(),
            propertyName: 'sportjahr5',
            width: 40,
          },
          {
            translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHNITT_JAHRE',
            propertyName: 'allejahreSchnitt',
            width: 40,
            sortable: true
          },
        ],
      };
      // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
    }
    this.loadingData = false;
  }

  private async loadSchuetzenstatistiken(index) {
    await this.schuetzenstatistikDataProvider.getSchuetzenstatistikWettkampf(this.selectedMannschaft.vereinId, this.selectedWettkampfTag.id)
  .then((response: BogenligaResponse<SchuetzenstatistikDO[]>) => this.handleLoadStatisticSuccess(response.payload));
    if (index < this.wettkaempfe.length - 1) {
      index += 1;
      return this.loadSchuetzenstatistiken(index);
    }
  }

  private async loadSchuetzenstatistikenMatch(index) {
    await this.schuetzenstatistikMatchDataProvider.getSchuetzenstatistikMatchWettkampf(this.selectedMannschaft.vereinId, this.selectedWettkampfTag.id, this.selectedWettkampfTag.wettkampfTag)
      .then((response: BogenligaResponse<SchuetzenstatistikMatchDO[]>) => this.handleLoadStatisticSuccess(response.payload))
      .catch((response: BogenligaResponse<SchuetzenstatistikMatchDO[]>) => this.handleLoadStatisticSuccess(response.payload));
    if (index < this.wettkaempfe.length - 1 && this.loadingData) {
      index += 1;
      return this.loadSchuetzenstatistikenMatch(index);
    }
  }

  private handleLoadStatisticSuccess(payload) {
    if (payload.length > 0) {
      const formattedRows = this.formatStatistik(toTableRows(payload));
      this.rows.push(formattedRows);
      this.currentWettkampftag = 0;
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

  private getLatestWettkampfTag(): WettkampfDTO {
    if (!this.wettkaempfe) {
      return null;
    }
    let latestWettkampf: WettkampfDTO = this.wettkaempfe[0];
    this.wettkaempfe.forEach((wettkampf) => {
      const wkDate = new Date(wettkampf.wettkampfDatum);
      if (wkDate > new Date(latestWettkampf.wettkampfDatum) && wkDate <= new Date()) {
        latestWettkampf = wettkampf;
      }
    });
    return latestWettkampf;
  }
}

