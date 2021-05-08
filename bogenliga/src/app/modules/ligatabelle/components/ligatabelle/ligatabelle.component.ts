import {Component, OnInit} from '@angular/core';
// import {NotificationService} from '@shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG} from './ligatabelle.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {WettkampfDataProviderService} from '@wettkampf/services/wettkampf-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {LigatabelleErgebnisDO} from '@wettkampf/types/wettkampf-ergebnis-do.class';
import {isUndefined} from '@shared/functions';
import {NotificationService} from '@shared/services/notification';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';


const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './ligatabelle.component.html',
  styleUrls:   ['./ligatabelle.component.scss']
})
export class LigatabelleComponent extends CommonComponentDirective implements OnInit {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private ligatabelleDataProvider: WettkampfDataProviderService,
  ) {
    super();
  }

  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;


  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  public buttonForward: number;
  public selectedVeranstaltungName: string;


  public loading = true;
  public loadingLigatabelle = true;
  public multipleSelections = true;
  public rowsLigatabelle: TableRow[];
  public providedID: number;
  private hasID: boolean;
  private remainingLigatabelleRequests: number;

  private loadedVeranstaltungen: Map<number, VeranstaltungDO[]>;
  private selectedVeranstaltung: VeranstaltungDO;
  public loadedYears: SportjahrVeranstaltungDO[];
  public veranstaltungenForYear: VeranstaltungDO[];

  private yearIdMap: Map<number, SportjahrVeranstaltungDO>;
  private veranstaltungIdMap: Map<number, VeranstaltungDO>;

  public selectedVeranstaltungId: number;
  public selectedYearId: number;

  ngOnInit() {
    console.log('Bin im Liga');
    this.loadTableData();
    this.providedID = undefined;
    this.hasID = false;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.providedID = parseInt(params[ID_PATH_PARAM], 10);
        console.log('Provided Id ', this.providedID);
        this.hasID = true;

      } else {
        console.log('no params');
      }
    });
  }

  private async loadTableData() {
    this.loadedYears = [];
    this.loadedVeranstaltungen = new Map();
    this.yearIdMap = new Map();
    this.veranstaltungIdMap = new Map();

    const responseYear = await this.veranstaltungsDataProvider.findAllSportyearDestinct();
    this.loadedYears = responseYear.payload;

    for (const year of responseYear.payload) {
      this.yearIdMap.set(year.id, year);
      const responseVeranstaltung = await this.veranstaltungsDataProvider.findBySportyear(year.sportjahr)
      this.loadedVeranstaltungen.set(year.sportjahr, responseVeranstaltung.payload);

      for (const veranstaltung of responseVeranstaltung.payload) {
        this.veranstaltungIdMap.set(veranstaltung.id, veranstaltung)
      }
    }

    this.loading = false;
    this.loadingLigatabelle = false;
    this.selectedYearId = this.loadedYears[0].id;
    this.onSelectYear(this.loadedYears); //automatische Auswahl
  }

  private loadLigaTableRows() {
    this.loadingLigatabelle = true;
    this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltung.id)
        .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLigatabelleSuccess(response))
        .catch(() => this.handleLigatabelleFailure());
  }

  private handleLigatabelleFailure() {
    console.log('failure');
    this.rowsLigatabelle = [];
    this.loadingLigatabelle = false;
  }

  private handleLigatabelleSuccess(response: BogenligaResponse<LigatabelleErgebnisDO[]>) {
    console.log('success')
    this.rowsLigatabelle = []; // reset array to ensure change detection
    this.remainingLigatabelleRequests = response.payload.length;
    if (response.payload.length <= 0
    ) {
      this.loadingLigatabelle = false;
    } else {
      this.rowsLigatabelle = toTableRows(response.payload);
      this.loadingLigatabelle = false;
    }
  }

  public ligatabelleLinking() {
    const link = '/wettkaempfe/' + this.buttonForward;
    this.router.navigateByUrl(link);
  }

  public onSelectYear($event: SportjahrVeranstaltungDO[]) {
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button');
    buttonVisibility.style.display = 'block';
    this.veranstaltungenForYear = [];
    this.veranstaltungenForYear = this.loadedVeranstaltungen.get($event[0].sportjahr);
    this.selectedVeranstaltungId = this.veranstaltungenForYear[0].id
    this.onSelectVeranstaltung([this.veranstaltungIdMap.get(this.selectedVeranstaltungId)]); //automatische Auswahl
  }

  public onSelectVeranstaltung($event: VeranstaltungDO[]) {
    this.selectedVeranstaltung = $event[0];
    this.selectedVeranstaltungName = this.selectedVeranstaltung.name;
    this.buttonForward = this.selectedVeranstaltung.id;
    this.loadLigaTableRows();
  }

}
