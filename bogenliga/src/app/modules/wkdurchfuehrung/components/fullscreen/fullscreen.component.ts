import { Component, OnInit } from '@angular/core';
import { SessionHandling } from '@shared/event-handling';
import {CurrentUserService, NotificationService, OnOfflineService} from '@shared/services';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import { ActionButtonColors } from '@shared/components/buttons/button/actionbuttoncolors';
import { LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG } from '../../../ligatabelle/components/ligatabelle/ligatabelle.config';
import { interval, Subscription } from 'rxjs';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faSitemap, faUndo} from '@fortawesome/free-solid-svg-icons';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {ActivatedRoute, Router} from '@angular/router';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {LigatabelleDataProviderService} from '../../../ligatabelle/services/ligatabelle-data-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {LigatabelleErgebnisDO} from '../../../ligatabelle/types/ligatabelle-ergebnis-do.class';

const ID_PATH_PARAM = 'id';
@Component({
  selector: 'bla-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent extends CommonComponentDirective implements OnInit {

  private sessionHandling: SessionHandling;
  public zuDenLigadetailsIcon: IconProp = faSitemap;
  public zuruecksetzenIcon: IconProp = faUndo;
  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;
  public ActionButtonColors = ActionButtonColors;
  public loading = true;
  public multipleSelections = true;
  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  public buttonForward: number;
  public selectedVeranstaltungName: string;
  public selectedVeranstaltungId: number;

  currentTime: string;
  private timeSubscription: Subscription;

  public loadingLigatabelle = true;
  public rowsLigatabelle: TableRow[];
  public providedID: number;
  private hasID: boolean;
  private hasVeranstaltung: boolean = true;

  private isDeselected: boolean = false;
  private remainingLigatabelleRequests: number;


  private loadedVeranstaltungen: Map<number, VeranstaltungDO[]>;
  private selectedVeranstaltung: VeranstaltungDO;

  private veranstaltungIdMap: Map<number, VeranstaltungDO>;
  public selectedItemId: number;
  private selectedYearForVeranstaltung: number; //In der Tabelle selektiertes Sportjahr



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private ligatabelleDataProvider: LigatabelleDataProviderService,
    private onOfflineService: OnOfflineService,
    private currentUserService: CurrentUserService,
  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit(): void {
    this.startClock();
    if(!this.isDeselected) {
      console.log('Component is not deselected.');
      this.providedID = undefined;
      this.hasID = false;
      this.notificationService.discardNotification();
      this.route.params.subscribe((params) => {
        console.log('Route params subscribed:', params);
        if (!isNaN(params['veranstaltungId'])) {
          // Konvertiere es in eine Zahl
          this.selectedVeranstaltungId = +params['veranstaltungId'];

          this.loadTableData(this.selectedVeranstaltungId);
          console.log('Table data loaded.');
        } else {
          console.error('Ungültige Veranstaltungs-ID');
          this.router.navigate(['/error']); // Weiterleitung zu einer Fehlerseite
        }
      });
    }
  }

  startClock() {
    this.currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    this.timeSubscription = interval(60000).subscribe(() => {
      this.currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    });
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public loadVeranstaltungFromLigaIDAndSportYear(urlLigaID: number, selectedSportYear: number){
    this.veranstaltungsDataProvider.findByLigaIdAndYear(urlLigaID, selectedSportYear)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungFailure(response));
  }

  private handleFindVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDO>): void {
    this.hasVeranstaltung = true;
    this.selectedItemId = response.payload.id;
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

  public async loadTableData(veranstaltungId: number) {
    this.loading = true;
    try {
      // Lade die spezifische Veranstaltung basierend auf der übergebenen ID
      const response = await this.veranstaltungsDataProvider.findById(veranstaltungId);

      if (response?.payload) {
        this.selectedVeranstaltung = response.payload;
        console.log('Ausgewählte Veranstaltung geladen:', this.selectedVeranstaltung);

        // Lade Ligatabelle-Daten für die ausgewählte Veranstaltung
        this.loadLigaTableRows();
      } else {
        console.log('Keine Veranstaltung gefunden mit der ID:', veranstaltungId);
      }
    } catch (e) {
      console.error('Fehler beim Laden der Veranstaltungsdaten:', e);
    } finally {
      this.loading = false;
      this.loadingLigatabelle = false;
    }
  }

  private loadLigaTableRows() {
    if (!this.selectedVeranstaltung) {
      console.log('Keine Veranstaltung ausgewählt, Ligatabelle kann nicht geladen werden.');
      return;
    }

    this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltung.id)
        .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => {
          if (response && response.payload.length > 0) {
            this.rowsLigatabelle = toTableRows(response.payload);
            console.log('Ligatabelle erfolgreich geladen');
          } else {
            console.log('Keine Ergebnisse gefunden für Ligatabelle');
            this.rowsLigatabelle = [];
          }
        })
        .catch(error => {
          console.error('Fehler beim Laden der Ligatabelle:', error);
          this.rowsLigatabelle = [];
        })
        .finally(() => {
          this.loadingLigatabelle = false;
        });
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


  public goToLigaDetails(){
    console.log("IDDD" + this.providedID);
    const link = '/home/' +  this.providedID;
    this.router.navigateByUrl(link);
  }

}
