import {Component, OnInit, OnDestroy} from '@angular/core';
import {HOME_CONFIG} from './home.config';
import {BogenligaResponse} from '@shared/data-provider';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {WETTKAMPF_TABLE_CONFIG} from '@home/components/home/wettkampf/wettkampf.config';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {formatDate, registerLocaleData} from '@angular/common';
import localeDE from '@angular/common/locales/de';
import {LoginDataProviderService} from '@user/services/login-data-provider.service';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {onMapService} from '@shared/functions/onMap-service.ts';
import {SessionHandling} from '@shared/event-handling';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import { Subscription } from 'rxjs';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';

const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})
export class HomeComponent extends CommonComponentDirective implements OnInit, OnDestroy {

  public config = HOME_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;

  public ActionButtonColors = ActionButtonColors;
  public wettkaempfeDTO: WettkampfDTO[];
  public wettkaempfeDO: WettkampfDO[];

  /**Storing the information about the current selected Liga
   * that should be displayed depending on the url
   */
  private selectedLigaName: string;
  private selectedLigaID: number;
  private selectedLigaDetails: string;

  public loadingWettkampf = true;
  public loadingTable = false;
  public rows: TableRow[] = [];
  public currentDate: number =  Date.now();
  public dateHelper: string;
  public providedID: number;
  public hasID: boolean;

  private sessionHandling: SessionHandling;
  private routeSubscription: Subscription;
  private loadedLigaData: boolean;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private ligaDataProvider: LigaDataProviderService,
    private logindataprovider: LoginDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);

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

  async ngOnInit() {

    if (this.currentUserService.isLoggedIn() === false) {
      await this.logindataprovider.signInDefaultUser()
          .then(() => this.handleSuccessfulLogin());
    } else if (this.currentUserService.isLoggedIn() === true) {
      this.loadWettkaempfe();
    }

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.providedID = parseInt(params[ID_PATH_PARAM], 10);
        this.hasID = true;
      } else {
        this.hasID = false;
      }
    });

    /**
     * On URL change
     * check if there is an ID in the URL,
     * check if it is valid and load Liga
     * */

    this.checkingAndLoadingLiga();
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.checkingAndLoadingLiga();
      }
    });
  }


  /**unsubscribe to avoid memory leaks*/
  ngOnDestroy() {
    this.hasID ? this.routeSubscription.unsubscribe() : null;
  }

  /**Check if LigaID of URL exists and load the corresponding page*/
  private checkingAndLoadingLiga(){
    this.hasID ? this.loadLiga(this.providedID) : null;
  }


  /**
   * backend call to get list
  */
  private loadWettkaempfe(): void {
      this.wettkaempfeDTO = [];
      this.wettkaempfeDO = [];
      this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDTO[]>) => { this.handleSuccessLoadWettkaempfe(response.payload); })
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => {this.wettkaempfeDTO = response.payload; });
  }


  /**
   * Backend call to get Liga from the Parameter in the URL (LigaID)
   * to display LigaDetailSeite
   * */

   private async loadLiga(urlLigaID : number){
    await this.ligaDataProvider.findById(urlLigaID)
        .then((response: BogenligaResponse<LigaDO>) => this.handleFindLigaSuccess(response))
        .catch((response: BogenligaResponse<LigaDO>) => this.handleFindLigaFailure(response));
  }


  /**Handling a successfull backendcall to get Liga by LigaIDa*/
  private handleFindLigaSuccess(response: BogenligaResponse<LigaDO>) : void {
    this.selectedLigaName=response.payload.name;
    this.selectedLigaID=response.payload.id;
    this.selectedLigaDetails=response.payload.ligaDetail;
    this.loadedLigaData=true;

    console.log("\n\n\n\n" + this.selectedLigaDetails);
  }

  /**Handling a failed backendcall to get Liga by LigaID
   * if LigaID not present in DB, then route to home
   * */
  public handleFindLigaFailure(response: BogenligaResponse<LigaDO>) : void {
    //routing back to home URL
    const link = '/home';
    this.router.navigateByUrl(link);
  }

  private handleSuccessLoadWettkaempfe(payload: WettkampfDTO[]): void {
    this.wettkaempfeDTO = payload;
    this.wettkaempfeDTO.forEach((wettkampf) => {this.wettkaempfeDO.push( new WettkampfDO(
      wettkampf.id,
      wettkampf.wettkampfVeranstaltungsId,
      wettkampf.wettkampfDatum,
      wettkampf.wettkampfStrasse,
      wettkampf.wettkampfPlz,
      wettkampf.wettkampfOrtsname,
      wettkampf.wettkampfOrtsinfo,
      wettkampf.wettkampfBeginn,
      wettkampf.wettkampfTag,
      wettkampf.wettkampfDisziplinId,
      wettkampf.wettkampfTypId,
      wettkampf.version)
    );  });

    this.checkDate();
    this.wettkaempfeDO.forEach((wettkampf) => {this.findLigaNameByVeranstaltungsId(wettkampf); });
    this.fillTableRows();
    this.loadingWettkampf = false;
  }

  private findLigaNameByVeranstaltungsId(wettkampf: WettkampfDO): void {
    this.veranstaltungDataProvider.findById(wettkampf.wettkampfVeranstaltungsId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => {
          wettkampf.wettkampfLiga = response.payload.name;
        })
        .catch((response: BogenligaResponse<VeranstaltungDTO>) => {
          console.log('LigaName not found');
        });

  }

  /**
   * Creates Link to Google Maps
   * Splits given Location at every comma and passes it to Google Maps
   * @param $event
   */
  public onMap($event: WettkampfDO): void {
    onMapService($event);
  }

  /**
   * Restriction that only a maximum of six events are portrayed
   * BSAPP- 367
   */
  private fillTableRows(): void {
    this.rows = [];

    if (this.wettkaempfeDO.length < 6) {
      this.rows = toTableRows(this.wettkaempfeDO);
    } else {
      this.rows = toTableRows(this.wettkaempfeDO.slice(0, 5));
    }
  }

  /**
   * BSAPP - 783
   * Check if Table is empty
   */
  public checkIfTableIsEmpty(): boolean {
    return this.rows.length === 0;
  }

  /**
   * Checks that only dates that are in the future will be portrayed
   * BSAPP-366
   */
  private checkDate() {
    /**
     * Gives the german date - otherwise always the american
     */

    registerLocaleData(localeDE);
    this.dateHelper = formatDate(this.currentDate, 'yyyy-MM-dd', 'de');

    for (let i = 0; i < this.wettkaempfeDO.length; i++) {
      /**
       * Turns the strings into date objects which can be easily compared
       */
      const wettkampfDate = new Date(this.wettkaempfeDO[i].wettkampfDatum);
      const heuteDate = new Date(this.currentDate);

      if (wettkampfDate < heuteDate) {
        /**
         * Splice takes out the number of values/objects defined in 'deleteCount'
         * it then moves the rest objects up - that's why we need the i--
         */
        this.wettkaempfeDO.splice(i, 1);
        i--;
      }
    }
  }

  public ligatabelleLinking() {
    const link = '/wettkaempfe/' + this.providedID;
    this.router.navigateByUrl(link);

    this.getVeranstaltungen(2); //TODO:hardcode ändern
  }

  private getVeranstaltungen(ligaId: number){
    var veranstaltungsListe = [];
    this.veranstaltungDataProvider.findByLigaId(ligaId)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {
          //hier abspeichern
          veranstaltungsListe=response.payload.
        })
        .catch((response: BogenligaResponse<VeranstaltungDTO>) => {
          //error
        });
  }


  private handleSuccessfulLogin() {
    this.loadWettkaempfe();
  }

}

