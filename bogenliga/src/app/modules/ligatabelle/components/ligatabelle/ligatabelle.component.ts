import {Component, OnInit} from '@angular/core';
// import {NotificationService} from '@shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG} from './ligatabelle.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from '../../../wettkampf/services/wettkampf-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {LigatabelleErgebnisDO} from '../../../wettkampf/types/wettkampf-ergebnis-do.class';
import {isUndefined} from '@shared/functions';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {NotificationService} from '@shared/services/notification';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';

const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './ligatabelle.component.html',
  styleUrls:   ['./ligatabelle.component.scss']
})
export class LigatabelleComponent extends CommonComponentDirective implements OnInit {


  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private ligatabelleDataProvider: WettkampfDataProviderService,
              private ligaDataProviderService: LigaDataProviderService) {
    super();
  }

  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;



  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  public selectedVeranstaltungId: number;
  public selectedVeranstaltungName: string;
  private selectedVeranstaltung: VeranstaltungDO;
  public selectedDTOs: VeranstaltungDO[];
  public multipleSelections = true;
  public veranstaltungen: VeranstaltungDO[];
  public loadingYear: boolean;
  public ligen: LigaDO[];
  public selectedLigen: LigaDO[];
  public zwVeranstaltung: VeranstaltungDTO;
  public loadingVeranstaltungen = true;
  public loadingLigatabelle = false;
  public rowsLigatabelle: TableRow[];
  private tableContent: Array<LigatabelleErgebnisDO> = [];
  private remainingLigatabelleRequests: number;
  public providedID: number;
  private selectedLiga: LigaDO;
  public selectedLigaId: number;
  private hasID: boolean;

  public veranstaltungenInLiga: VeranstaltungDO[];




  ngOnInit() {
    console.log('Bin im Liga');
    this.loading = true;
    this.providedID = undefined;
    this.hasID = false;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.providedID = parseInt(params[ID_PATH_PARAM] , 10);
        console.log(this.providedID);
        this.hasID = true;
      } else {
        console.log('no params');
      }
    });
    console.log(this.selectedLigaId);
    this.loadLigen();
  }

  private changeSelectedLiga(): void {
    this.selectedLigen = [];
    if (this.hasID) {
      this.ligaDataProviderService.findById(this.selectedLigaId)
          .then((response: BogenligaResponse<LigaDTO>) =>
            this.getLigaSuccess(response.payload)
          ).catch((response: BogenligaResponse<LigaDTO[]>) => {
        this.ligen = response.payload;
      });
    }
    this.selectedLigen.push(this.selectedLiga);
    console.log('CurrentLiga: ' + this.selectedLiga);
  }
  private getLigaSuccess(response: LigaDTO) {
    console.log('response in getLiga: ' + response.name);
    this.selectedLiga = response;
  }


  public onSelectLiga($event: LigaDO[]): void {
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
    buttonVisibility.style.display = 'block';

    this.selectedLigen = [];
    this.selectedLigen = $event;

    if (!!this.selectedLigen && this.selectedLigen.length > 0) {
      this.loadTableRows(this.selectedLigen[0].id);
    }
    this.selectedDTOs = [];
    this.selectedVeranstaltungId = null;

    this.onSelect(this.veranstaltungsDataProvider.findByLigaId(this.selectedLigen[0].id)[0]);
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
    this.changeVeranstaltung();
  }

  // Changes the displayed Veranstaltung with the current selected one from selectedDTOs.
  private changeVeranstaltung(): void {
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
                                                                    buttonVisibility.style.display = 'none'; this.veranstaltungen = response.payload; this.onSelect(this.veranstaltungen);
                                                                    this.loadingVeranstaltungen = false; })
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => {this.veranstaltungen = response.payload; });
  }
  // Load all Ligen into the Tabel and strats the selection from the chosen.
  private loadLigen(): void {
    this.ligen = [];
    this.ligaDataProviderService.findAll()
        .then((response: BogenligaResponse<LigaDTO[]>) => {
          const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
          buttonVisibility.style.display = 'none'; this.ligen = response.payload; this.selectedLiga = response.payload[0];
          this.selectedLigaId = this.hasID ? this.providedID : response.payload[0].id; console.log(this.selectedLigaId);
          this.changeSelectedLiga();
          this.onSelectLiga(this.selectedLigen);
          this.loadingVeranstaltungen = false; })
        .catch((response: BogenligaResponse<LigaDTO[]>) => {this.ligen = response.payload; });
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
  public ligatabelleLinking() {
    const link = '/wettkaempfe/' + this.selectedVeranstaltungId;
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

  private loadTableRows(ligaID: number) {
    this.loading = true;
    this.veranstaltungsDataProvider.findByLigaId(ligaID)
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadTableRowsFailure(response));
  }
  private handleLoadTableRowsFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.veranstaltungenInLiga = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    this.veranstaltungenInLiga = []; // reset array to ensure change detection
    this.veranstaltungenInLiga = response.payload;
    this.onSelect(this.veranstaltungenInLiga);
    console.log(this.veranstaltungenInLiga);
    this.loading = false;
  }

}
