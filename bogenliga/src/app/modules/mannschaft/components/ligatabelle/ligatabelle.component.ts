import {Component, OnInit} from '@angular/core';
import {LIGATABELLE_CONFIG} from './ligatabelle.config';
import {LIGA_TABELLE_CONFIG} from './ligatabelle.config';
import {VeranstaltungDataProviderService} from '@vereine/services/veranstaltung-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDO} from '@vereine/types/veranstaltung-do.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {LigatabelleErgebnisDO} from '../../types/ligatabelle-ergebnis-do.class';
import {LigatabelleErgebnisService} from '../../services/ligatabelle-ergebnis.service';

@Component({
  selector: 'bla-ligatabelle',
  templateUrl: './ligatabelle.component.html'
})
export class LigatabelleComponent extends CommonComponent implements OnInit {

  public config = LIGATABELLE_CONFIG;
  public config_table = LIGA_TABELLE_CONFIG;

  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public ligatabelleErgebnisse: Array<LigatabelleErgebnisDO[]> = new Array<LigatabelleErgebnisDO[]>();


  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private ligatabelleErgebnisService: LigatabelleErgebnisService) {
    super();
  }

  ngOnInit() {
    this.loadVeranstaltungen();
  }

  loadVeranstaltungen() {
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
        .catch((response: BogenligaResponse<VeranstaltungDO[]>) => this.veranstaltungen = []);

  }

  handleSuccessLoadVeranstaltungen(respone: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = respone.payload;
    this.currentVeranstaltung.id = this.veranstaltungen[0].id;
  }


  private fillTableRows(): void {
    this.rows = [];
    console.log('Ergebnisse an 0:');
    console.log(this.ligatabelleErgebnisse[0]);

    this.rows.push(toTableRows(this.ligatabelleErgebnisse[0]));
    console.log('tableRows:');
    console.log(this.rows);

  }


 }
