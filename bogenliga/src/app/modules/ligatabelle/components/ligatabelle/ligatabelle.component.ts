import {Component, OnInit} from '@angular/core';
// import {NotificationService} from '@shared/services';
import {faSitemap } from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG} from './ligatabelle.config';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {LigatabelleDataProviderService} from '../../services/ligatabelle-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {LigatabelleErgebnisDO} from '../../types/ligatabelle-ergebnis-do.class';
import {isUndefined} from '@shared/functions';
import {NotificationService} from '@shared/services/notification';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {SessionHandling} from '@shared/event-handling';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {getActiveSportYear} from '@shared/functions/active-sportyear';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {faUndo} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {SelectedLigaDataprovider} from '../../../shared/data-provider/SelectedLigaDataprovider'




const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './ligatabelle.component.html',
  styleUrls:   ['./ligatabelle.component.scss']
})
export class LigatabelleComponent extends CommonComponentDirective implements OnInit {

  private sessionHandling: SessionHandling;

  public zuDenLigadetailsIcon: IconProp = faSitemap;
  public zuruecksetzenIcon: IconProp = faUndo;

  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;


  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  public buttonForward: number;
  public selectedVeranstaltungName: string;
  public ActionButtonColors = ActionButtonColors;


  public loading = true;
  public loadingLigatabelle = true;
  public multipleSelections = true;
  public rowsLigatabelle: TableRow[];
  public providedID: number;
  private hasID: boolean;
  private hasVeranstaltung: boolean = true;

  private isDeselected: boolean = false;
  private remainingLigatabelleRequests: number;

  private loadedVeranstaltungen: Map<number, VeranstaltungDO[]>;
  private selectedVeranstaltung: VeranstaltungDO;
  public loadedYears: SportjahrVeranstaltungDO[];
  public availableYears: SportjahrVeranstaltungDO[];
  public veranstaltungenForYear: VeranstaltungDO[];

  private veranstaltungIdMap: Map<number, VeranstaltungDO>;

  public selectedVeranstaltungId: number;
  public selectedYearId: number;
  public selectedItemId: number;
  private aktivesSportjahr: number;
  private selectedYearForVeranstaltung: number; //In der Tabelle selektiertes Sportjahr
  private istURLkorrekt: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private ligatabelleDataProvider: LigatabelleDataProviderService,
    private onOfflineService: OnOfflineService,
    private currentUserService: CurrentUserService,
    private einstellungenDataProvider: EinstellungenProviderService,
    private selectedLigaDataprovider: SelectedLigaDataprovider,
  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    if(this.isDeselected == false) {
      this.loadTableData();
      this.providedID = undefined;
      this.hasID = false;
      this.notificationService.discardNotification();
      this.route.params.subscribe((params) => {
        if (!isUndefined(params[ID_PATH_PARAM])) {
          this.providedID = parseInt(params[ID_PATH_PARAM], 10);
          this.hasID = true;
          params[ID_PATH_PARAM] === "ligaid" ? this.hasID = false : undefined;
          this.selectedYearForVeranstaltung != undefined && this.hasID
            ? this.loadVeranstaltungFromLigaIDAndSportYear(this.providedID, this.selectedYearForVeranstaltung) : undefined;
        } else {
          console.log('no params at ligatabelle');
          this.router.navigate(['/ligatabelle/ligaid']);
        }
      });
    }
  }

  public loadVeranstaltungFromLigaIDAndSportYear(urlLigaID: number, selectedSportYear: number){
    this.veranstaltungsDataProvider.findByLigaIdAndYear(urlLigaID, selectedSportYear)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungFailure(response));
  }

  private handleFindVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDO>): void {
    this.hasVeranstaltung = true;
    this.selectedItemId = response.payload.id;
    this.onSelectVeranstaltung([response.payload]);
  }

  private handleFindVeranstaltungFailure(error: any): void {
    // Routing zurück zur Ligatabelle URL, wenn keine ID gefunden wird
    this.hasVeranstaltung = false;
    const link = '/ligatabelle';
    this.router.navigateByUrl(link);
  }


  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  private async loadTableData() {
    /*
     Hier werden zu Beginn alle benötigten Daten geladen und die jeweiligen Variablen geschrieben.
     Jahr -> Liga (ohne Dopplung) -> Veranstaltung
     laodedYears sind dabei alle vorhanden Jahre, availableYears nur die in denen auch etwas steht.
     */

    this.loadedYears = [];
    this.availableYears = [];
    this.loadedVeranstaltungen = new Map();
    this.veranstaltungIdMap = new Map();
    let indexOfSelectedYearInAvailableYears = 0;
    let counter = 0;
    let selectedYear: SportjahrVeranstaltungDO[] = [];

    try {
      console.log(this.onOfflineService.isOffline());
      const responseYear = await this.veranstaltungsDataProvider.findAllSportyearDestinct();
      this.loadedYears = responseYear.payload;

      for (const year of responseYear.payload) {
        const responseVeranstaltung = await this.veranstaltungsDataProvider.findBySportjahrDestinct(year.sportjahr);

        for (const veranstaltung of responseVeranstaltung.payload) {
          /*
           Sobald es keine Veranstaltung für dieses Sporjahr gibt bekommen wir einen leeren Array in responseVeranstaltung.payload zurück,
           somit kann nicht iteriert werden. Ist veranstaltung als VeranstaltungDO aber vorhanden iterieren wir.
           Dadurch wird gleichzeitig nur die Tabellen mit Werten befüllt die auch Veranstaltungen haben.
           */

          this.veranstaltungIdMap.set(veranstaltung.id, veranstaltung); // -> Ligatabelle
          this.loadedVeranstaltungen.set(year.sportjahr, responseVeranstaltung.payload);  // -> "Liga"
          if (!this.availableYears.includes(year)) {
            this.availableYears.push(year); // -> "Sportjahr"
          }
        }
      }

      // lese aktives Sportjahr aus Datenbank aus aus im Online-Modus
      if(!this.onOfflineService.isOffline()) {
        this.aktivesSportjahr = await getActiveSportYear(this.einstellungenDataProvider);
      }
      // Prüfe ob das aktive Sportjahr in der Liste der verfügbaren Jahre ist
      for (const sportjahr of this.availableYears) {
        // finde Index von aktivem Sportjahr in der Liste, sonst nimm neustes Jahr (index = 0, siehe Initialisierung)
        if (sportjahr.sportjahr === this.aktivesSportjahr) {
          indexOfSelectedYearInAvailableYears = counter;
        }
        counter++;
      }
      this.loading = false;
      this.loadingLigatabelle = false;
      this.selectedYearId = this.availableYears[indexOfSelectedYearInAvailableYears].id;

      if (this.availableYears.length > 0) {
        // Selektiert das aktive Sportjahr (wenn vorhanden) oder das aktuellste Jahr (IndexOfSelectedYearInAvailableYears = 0)
        selectedYear.push(this.availableYears[indexOfSelectedYearInAvailableYears]);
        this.onSelectYear(selectedYear); // automatische Auswahl nur bei vorhandenen Daten
      }
    } catch (e) {
      this.loading = false;
      this.loadingLigatabelle = false;
      console.log(e);
    }
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
    console.log('success');
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
    /*
     onSelectYear wird einmal zu Beginn für eine automatische Auswahl aufgerufen und jedes mal wenn das Jahr geändert wird.
     Dabei werden die Ligen für das ausgewählte Jahr aufgerufen und angezeigt.
     */
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button');
    buttonVisibility.style.display = 'block';
    this.veranstaltungenForYear = [];
    this.selectedYearForVeranstaltung = $event[0].sportjahr; //Ausgewähltes Jahr in der Liste speichern
    this.veranstaltungenForYear = this.loadedVeranstaltungen.get($event[0].sportjahr);
    this.selectedVeranstaltungId = this.veranstaltungenForYear[0].id;
    this.hasID ? this.loadVeranstaltungFromLigaIDAndSportYear(this.providedID, this.selectedYearForVeranstaltung) : undefined;
  }

  public onSelectVeranstaltung($event: VeranstaltungDO[]) {
    /*
     onSelectVeranstaltung wird einmal zu Beginn für eine automatische Auswahl aufgerufen und jedes mal wenn die "Liga" geändert wird.
     In der Liga kann aber nur eine Veranstaltung sein also wählt man quasi durch die Liga direkt die Veranstaltung daher der Name.
     Dabei wird loadLigaTableRows aufgerufen welches ganz unten auf der Seite die Ligatabelle anzeigt.
     */
    this.selectedVeranstaltung = $event[0];
    this.selectedVeranstaltungName = this.selectedVeranstaltung.name;
    this.buttonForward = this.selectedVeranstaltung.id;
    this.loadLigaTableRows();
    const link = '/ligatabelle/' +  this.selectedVeranstaltung.ligaId;
    this.router.navigate([link]);
  }


  public deselect(){
    this.isDeselected = true;
    console.log(this.isDeselected);
    const link = '/ligatabelle';
    this.router.navigateByUrl(link);
  }

  public goToLigaDetails(){
    console.log("IDDD" + this.providedID);
    const link = '/home/' +  this.providedID;
    this.router.navigateByUrl(link);
  }
}
