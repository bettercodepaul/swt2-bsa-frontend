import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponent, toTableRows} from '@shared/components';
import {LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG} from './ligatabelle.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from '../../../wettkampf/services/wettkampf-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {} from '@shared/components/forms/';
import {LigatabelleErgebnisDO} from '../../../wettkampf/types/wettkampf-ergebnis-do.class';
import {LigatabelleErgebnisDTO} from '../../../wettkampf/types/datatransfer/wettkampf-ergebnis-dto.class';
import {NotificationService} from '@shared/services';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './ligatabelle.component.html',
  styleUrls:   ['./ligatabelle.component.scss']
})
export class LigatabelleComponent extends CommonComponent implements OnInit {

  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;



  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  private selectedVeranstaltungId: number;
  private selectedVeranstaltungName: string;
  public selectedDTOs: VeranstaltungDO[];
  public multipleSelections = true;
  public veranstaltungen: VeranstaltungDO[];
  public loadingVeranstaltungen = true;
  public loadingLigatabelle = false;
  public rowsLigatabelle: TableRow[];
  private tableContent: Array<LigatabelleErgebnisDO> = [];
  private remainingLigatabelleRequests: number;



  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private ligatabelleDataProvider: WettkampfDataProviderService) {
    super();
  }



  ngOnInit() {
    this.loadVeranstaltungen();

  }



  // when a Veranstaltung gets selected from the list
  // load LigaTabelle
  public onSelect($event: VeranstaltungDO[]): void {
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
    buttonVisibility.style.display = 'block';
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedVeranstaltungId = this.selectedDTOs[0].id;
      this.selectedVeranstaltungName = this.selectedDTOs[0].name;
    }
    this.rowsLigatabelle = [];
    this.tableContent = [];
    if (this.selectedVeranstaltungId != null) {
      this.loadLigaTableRows();
    }
  }


// backend-call to get the list of veranstaltungen
  private loadVeranstaltungen(): void {
    this.veranstaltungen = [];
    this.veranstaltungsDataProvider.findAll()
      .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
                                                                  buttonVisibility.style.display = 'none'; this.veranstaltungen = response.payload;  this.loadingVeranstaltungen = false; })
      .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload; });
  }



  private loadLigaTableRows() {
    this.loadingLigatabelle = true;
    this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltungId)
      .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLigatabelleSuccess(response))
      .catch((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLigatabelleFailure(response));
  }


  private handleLigatabelleFailure(response: BogenligaResponse<LigatabelleErgebnisDO[]>): void {
    this.rowsLigatabelle = [];
    this.loadingLigatabelle = false;
  }
  private LigatabelleLinking() {
      const link = '/wettkaempfe/' + this.selectedVeranstaltungName;
      this.router.navigateByUrl(link);
  }

  private handleLigatabelleSuccess(response: BogenligaResponse<LigatabelleErgebnisDO[]>): void {
    this.rowsLigatabelle = []; // reset array to ensure change detection
    this.remainingLigatabelleRequests = response.payload.length;
    if (response.payload.length <= 0) {
      this.loadingLigatabelle = false;
    } else {
      for (const ligatabelle of response.payload) {
        const tableContentRow: LigatabelleErgebnisDO = new LigatabelleErgebnisDO();

        tableContentRow.veranstaltung_id = ligatabelle.veranstaltung_id;
        tableContentRow.veranstaltung_name = ligatabelle.veranstaltung_name;
        tableContentRow.wettkampf_id = ligatabelle.wettkampf_id;
        tableContentRow.wettkampf_tag = ligatabelle.wettkampf_tag;
        tableContentRow.mannschaft_id = ligatabelle.mannschaft_id;
        tableContentRow.mannschaft_name = ligatabelle.mannschaft_name;
        tableContentRow.verein_id = ligatabelle.verein_id;
        tableContentRow.matchpunkte = ligatabelle.matchpunkte;
        tableContentRow.satzpunkte = ligatabelle.satzpunkte;
        tableContentRow.satzpkt_differenz = ligatabelle.satzpkt_differenz;
        tableContentRow.tabellenplatz = ligatabelle.tabellenplatz;


        tableContentRow.id = ligatabelle.id;
        tableContentRow.version = ligatabelle.version;

        this.tableContent.push(tableContentRow);
      }
      this.rowsLigatabelle = toTableRows(this.tableContent);
      this.loadingLigatabelle = false;
    }


  }

}
