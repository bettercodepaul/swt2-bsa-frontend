import {OnDestroy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {onMapService} from '@shared/functions/onMap-service.ts';
import {SessionHandling} from '@shared/event-handling';
import {ConsoleLogger} from '@angular/compiler-cli/ngcc';
import {element} from 'protractor';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {ID} from '../home/home.config';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {VERWALTUNG_CONFIG} from '@verwaltung/components/verwaltung/verwaltung.config';
import {HOME_SHORTCUT_BUTTON_CONFIG} from './home.config';
import {db, OfflineDB} from '@shared/data-provider/offlinedb/offlinedb';
import {
  VeranstaltungenButtonComponent
} from '@shared/components/buttons/veranstaltungen-button/veranstaltungen-button.component';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import { Subscription } from 'rxjs';

const ID_PATH_PARAM = 'id';

class VeranstaltungWettkaempfe {
  public veranstaltungDO: VeranstaltungDO;
  public wettkaempfeDO: WettkampfDO;
  public day: number;
  public month: string;
}
@Component({
  selector:    'bla-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})

export class HomeComponent extends CommonComponentDirective implements OnInit, OnDestroy {

  public config = HOME_CONFIG;

  public config_shortcut = HOME_SHORTCUT_BUTTON_CONFIG;

  public config_table = WETTKAMPF_TABLE_CONFIG;

  public ActionButtonColors = ActionButtonColors;
  public wettkaempfeDTO: WettkampfDTO[];
  public wettkaempfeDO: WettkampfDO[];
  public veranstaltungDTO: VeranstaltungDTO[];
  public veranstaltungDO: VeranstaltungDO[] = [];

  /**Storing the information about the current selected Liga
   * that should be displayed depending on the url
   */
  public selectedLigaName: string;
  public selectedLigaID: number;
  public selectedLigaDetails: string;
  public loadingWettkampf = true;
  public loadingTable = false;
  public rows: TableRow[] = [];
  public currentDate: number = Date.now();
  public dateHelper: string;
  public veranstaltungWettkaempfeDO: VeranstaltungWettkaempfe[] = [];
  public VereinsID: number;
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
    private einstellungenDataProvider: EinstellungenProviderService,
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
  @ViewChild('ligaleiter') ligaleiter: ElementRef;
  @ViewChild('ausrichter') ausrichter: ElementRef;
  @ViewChild('kampfrichter') kampfrichter: ElementRef;
  @ViewChild('sportleiter') sportleiter: ElementRef;


  public setCorrectID(){
    const verein = this.currentUserService.getVerein();
    this.VereinsID = verein;
  }
  public getCorrectID(): number {
    return this.VereinsID;
  }

  async ngOnInit() {

    if (this.currentUserService.isLoggedIn() === false) {
      await this.logindataprovider.signInDefaultUser()
          .then(() => this.handleSuccessfulLogin());
    } else if (this.currentUserService.isLoggedIn() === true) {
      this.loadWettkaempfe();
      this.findByVeranstalungsIds();
      this.setCorrectID();
      // ID(this.VereinsID); //TODO: beheben von Fehler bei diesem Code
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
        .then((response: BogenligaResponse<WettkampfDTO[]>) => {
          this.handleSuccessLoadWettkaempfe(response.payload);
        })
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => {
          this.wettkaempfeDTO = response.payload;
        });
  }


  /**
   * Backend call to get Liga from the Parameter in the URL (LigaID)
   * to display LigaDetailSeite.
   * Because checkExists always returns an object, handleGotLigaObject has to check
   * if the liga truly exists (if not, function returns empty LigaObject)
   * */

  private async loadLiga(urlLigaID : number){
    await this.ligaDataProvider.checkExists(urlLigaID)
      .then((response: BogenligaResponse<LigaDO>)=> this.handleGotLigaObjectSuccess(response))
      .catch((response: BogenligaResponse<LigaDO>)=>this.handleGotLigaObjectFailure(response))
  }

//console.log("Resultat vom Backendcall zu " + urlLigaID+" gekommen:"+ console.log(JSON.stringify(response.payload, null, 2)))


  /**
  *Handling a successfull backendcall to get Liga by LigaIDa
   **/
  private handleGotLigaObjectSuccess(response: BogenligaResponse<LigaDO>) : void {
    if(response.payload.id==null){ //means there is no liga with this ID
      //route to home and show pop-up
      //routing back to home URL
      const link = '/home';
      this.router.navigateByUrl(link);
    }
    else{
      this.selectedLigaName=response.payload.name;
      this.selectedLigaID=response.payload.id;
      this.selectedLigaDetails=response.payload.ligaDetail;
      this.loadedLigaData=true;
    }
  }

  /**
   * Handling a failed backendcall to get Liga by LigaID
   **/
  public handleGotLigaObjectFailure(response: BogenligaResponse<LigaDO>) : void {
    //routing back to home URL
    const link = '/home';
    this.router.navigateByUrl(link);
  }


  private handleSuccessLoadWettkaempfe(payload: WettkampfDTO[]): void {
    this.wettkaempfeDTO = payload;
    this.wettkaempfeDTO.forEach((wettkampf) => {
      this.wettkaempfeDO.push(new WettkampfDO(
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
      );
    });

    this.checkDate();
    this.wettkaempfeDO.forEach((wettkampf) => {
      this.findLigaNameByVeranstaltungsId(wettkampf);
    });
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

  public buildVeranstaltungskalender(): void {
    this.findByVeranstalungsIds().then(r => {
      let competitionList: any;
      console.log(this.wettkaempfeDO);
    });

  }
  private async findByVeranstalungsIds(): Promise<void> {

    let sportJahr = 0;
    await this.einstellungenDataProvider.findAll().then((x: BogenligaResponse<EinstellungenDO[]>) => {
      let sportJahrDo = x.payload.filter(x => x.key == 'aktives-Sportjahr')[0];
      sportJahr = parseInt(sportJahrDo.value);
    }).catch((response: BogenligaResponse<any>) => {
      sportJahr = 2018
    }).finally( async() =>{

     await this.veranstaltungDataProvider.findBySportyear(sportJahr).then((response: BogenligaResponse<VeranstaltungDO[]>) => {
        response.payload.forEach((element) => {
          this.veranstaltungDO.push(element);
        })
      }).catch((response: BogenligaResponse<VeranstaltungDO>) => {
        console.log('Veranstaltung not Found');
      });
     this.veranstaltungDO.forEach((element)=>{
       this.wettkampfDataProvider.findByVeranstaltungId(element.id).then((response: BogenligaResponse<WettkampfDO[]>) => {
         response.payload.forEach((elementWettkampf)=>{
           let veranstaltungWettkaempfeDOLocal: VeranstaltungWettkaempfe = {
             wettkaempfeDO : elementWettkampf,
             veranstaltungDO: element,
             month: this.numberToMonth(parseInt(elementWettkampf.wettkampfDatum.split("-")[1])),
             day: parseInt(elementWettkampf.wettkampfDatum.split("-")[2])


           };
           this.veranstaltungWettkaempfeDO.push(veranstaltungWettkaempfeDOLocal);
         })
       })
     })

    });
  }

  private numberToMonth(m:number):string{
    switch (m){
      case 1:
        return "JAN";
      case 2:
        return "FEB";
      case 3:
        return  "MÄR";
      case 4:
        return "APR";
      case 5:
        return "MAI";
      case 6:
        return "JUN";
      case 7:
        return "JUL";
      case 8:
        return "AUG";
      case 9:
        return "SEP";
      case 10:
        return "OKT";
      case 11:
        return "NOV";
      case 12:
        return "DEZ";
      default:
        return "";

    }

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
  }

  private handleSuccessfulLogin() {
    this.loadWettkaempfe();
    this.buildVeranstaltungskalender();
  }




}



