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
import {onMapService} from '@shared/functions/onMap-service.ts';
import {SessionHandling} from '@shared/event-handling';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {HOME_SHORTCUT_BUTTON_CONFIG} from './home.config';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import { Subscription } from 'rxjs';
import {element} from 'protractor';
import {SelectedLigaDataprovider} from '@shared/data-provider/SelectedLigaDataprovider';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
//for notification
import {
  CurrentUserService,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction,
  OnOfflineService,
  NotificationService
} from '@shared/services';


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

  public zurStartseiteIcon: IconProp = faHome;
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
  private selectedLigaName: string;
  private selectedLigaID: number;
  private selectedLigaDetails: string;
  private selectedLigaDetailBase64: string;
  private selectedLigaDetailFileName: string;
  private selectedLigaDetailFileType: string;
  public loadingWettkampf = true;
  public loadingTable = false;
  public rows: TableRow[] = [];
  public currentDate: number = Date.now();
  public dateHelper: string;
  public veranstaltungWettkaempfeDO: VeranstaltungWettkaempfe[] = [];

  public VereinsID: number;
  public providedID: number;
  public ligaName: string;
  public hasID: boolean;
  public hasLigaIDInUrl: boolean;
  public hasLigaNameInUrl: boolean;
  private sessionHandling: SessionHandling;
  private routeSubscription: Subscription;
  private loadedLigaData: boolean;
  public veranstaltung: VeranstaltungDO;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private einstellungenDataProvider: EinstellungenProviderService,
    private ligaDataProvider: LigaDataProviderService,
    private logindataprovider: LoginDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService,
    private selectedLigaDataprovider: SelectedLigaDataprovider) {
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
      await this.logindataprovider.signInDefaultUser().then(() => this.handleSuccessfulLogin());
    } else if (this.currentUserService.isLoggedIn() === true) {
      this.loadWettkaempfe();
      this.findByVeranstalungsIds();
      this.setCorrectID();
    }


    //to get if of liga from route path
    this.routeSubscription=this.route.params.subscribe((params) => {
      //if parameter ID_Path_PARAM is defined
      //it parses the parameter value as an integer and assigns it to the providedID variable

      //checking if url has parameter
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.hasID = true;
        //this.providedID = parseInt(params[ID_PATH_PARAM], 10);
        const paramIsNumber = !isNaN(Number(params[ID_PATH_PARAM]));


        //check if url has number or liganame
        if (!paramIsNumber) {
          this.ligaName = params[ID_PATH_PARAM]
          this.hasLigaIDInUrl = false;
          this.hasLigaNameInUrl=true;
          console.log("String liga name is: " + this.ligaName);
          this.ligaName? this.loadLiga(this.ligaName) : null;
        } else {
          this.providedID = parseInt(params[ID_PATH_PARAM], 10);
          this.hasLigaIDInUrl = true;
          this.hasLigaNameInUrl=false;
          console.log("Number ID is: " + this.providedID);
          this.checkingAndLoadingLiga(); // load liga with changes of id in url
        }
        this.hasLigaIDInUrl ? this.getVeranstaltungen(this.providedID):undefined;

      } else {
        this.hasLigaIDInUrl = false;
        this.hasLigaNameInUrl=false;
        this.hasID=false;
      }
    });
  }





  /**unsubscribe to avoid memory leaks*/
  ngOnDestroy() {
    if(this.hasLigaNameInUrl){
      this.hasLigaNameInUrl=undefined;
      this.hasLigaIDInUrl=undefined;
      this.routeSubscription.unsubscribe();
    }
    if(this.hasLigaIDInUrl){
      this.routeSubscription.unsubscribe();
      this.hasLigaIDInUrl=undefined;
      this.hasLigaNameInUrl=undefined;
    }
  }

  public deselect(){
    const link = '/home';
    this.router.navigateByUrl(link);
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


  /**File Download, converts Base64 string back to its original file with its original name*/
  public fileDownload(){

    const typeOfFile = this.selectedLigaDetailBase64.substring(this.selectedLigaDetailBase64.indexOf(':')+1, this.selectedLigaDetailBase64.indexOf(';'))
    this.selectedLigaDetailBase64 = this.selectedLigaDetailBase64.replace('data:' + typeOfFile + ';base64,', '');

    const byteArray = new Uint8Array(
      atob(this.selectedLigaDetailBase64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    const file = new Blob([byteArray], {type: this.selectedLigaDetailFileType});
    const fileUrl = URL.createObjectURL(file);
    let fileName = this.selectedLigaDetailFileName + this.getFileType(this.selectedLigaDetailFileType);
    let link = document.createElement('a');
    link.download = fileName;
    link.target = '_blank';
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  private getFileType(typeOfFile: string) {
    switch (typeOfFile) {
      case 'application/pdf':
        return '.pdf'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '.docx';
      case 'application/msword':
        return '.doc';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '.xlsx';
      case 'application/vnd.ms-excel':
        return '.xls';
      default:
        return '';
    }
  }




  /**
   * Backend call to get Liga from the Parameter in the URL (LigaID)
   * to display LigaDetailSeite.
   * Because checkExists always returns an object, handleGotLigaObject has to check
   * if the liga truly exists (if not, function returns empty LigaObject)
   * */


  private async loadLiga(urlLigaID : number | string){
    //If number or string, verschiedener backend call
    if (typeof urlLigaID === 'number'){
      await this.ligaDataProvider.checkExists(urlLigaID)
                .then((response: BogenligaResponse<LigaDO>)=> this.handleGotLigaObjectSuccess(response))
                .catch((response: BogenligaResponse<LigaDO>)=>this.handleGotLigaObjectFailure(response))
    } else {
      //check if underscore in text and replace with space
      urlLigaID = urlLigaID.replace(/_/g, ' ')
      urlLigaID=urlLigaID.toLowerCase()
      await this.ligaDataProvider.checkExistsLigaName(urlLigaID)
                .then((response: BogenligaResponse<LigaDO>)=> this.handleGotLigaObjectSuccess(response))
                .catch((response: BogenligaResponse<LigaDO>)=>this.handleGotLigaObjectFailure(response))
    }
  }


  /**
   *Handling a successfull backendcall to get Liga by LigaID
   * the response object is either:
   * - a liga
   * - null -> no liga with that id does exist
   **/

  private handleGotLigaObjectSuccess(response: BogenligaResponse<LigaDO>) : void {
    if(response.payload.id==null){
      //routing back to home URL
      const link = '/home';
      this.router.navigateByUrl(link);

      //show a pop-up if liga with that id does not exist
      this.notificationService.showNotification({
        id: 'LigaIDWarning',
        description: 'HOME.LIGADETAILES.DESCRIPTION',
        title: 'HOME.LIGADETAILES.IDWARNING',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.PENDING,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO,
      });
    }
    else{
      //store Liga information
      this.selectedLigaName=response.payload.name;
      this.selectedLigaID=response.payload.id;
      this.selectedLigaDetails=response.payload.ligaDetail;
      this.selectedLigaDetailBase64=response.payload.ligaDetailFileBase64;
      this.selectedLigaDetailFileName=response.payload.ligaDetailFileName;
      this.selectedLigaDetailFileType=response.payload.ligaDetailFileType;
      this.loadedLigaData=true;
      if(this.hasLigaNameInUrl){
        const link = '/home/' + this.selectedLigaID;
        this.router.navigateByUrl(link);
      }
    }
  }


  /**
   * Handling a failed backendcall to get Liga by LigaID
   **/
  public handleGotLigaObjectFailure(response: BogenligaResponse<LigaDO>) : void {//routing back to home URL
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
      console.error("Can not get sport Jahr");
    }).finally( async() =>{

     await this.veranstaltungDataProvider.findBySportyear(sportJahr).then((response: BogenligaResponse<VeranstaltungDO[]>) => {
        response.payload.forEach((element) => {
          this.veranstaltungDO.push(element);
        })
      }).catch((response: BogenligaResponse<VeranstaltungDO>) => {
        console.log('Veranstaltung not Found');
      });
     this.veranstaltungDO.forEach((element)=>{
       if(element.id != null){
         this.wettkampfDataProvider.findByVeranstaltungId(element.id).then((response: BogenligaResponse<WettkampfDO[]>) => {
           response.payload.forEach((elementWettkampf)=>{
             console.log(elementWettkampf);
             console.log(element)
             let veranstaltungWettkaempfeDOLocal: VeranstaltungWettkaempfe = {
               wettkaempfeDO : elementWettkampf,
               veranstaltungDO: element,
               month: this.numberToMonth(parseInt(elementWettkampf.wettkampfDatum.split("-")[1])),
               day: parseInt(elementWettkampf.wettkampfDatum.split("-")[2])
             };
             this.veranstaltungWettkaempfeDO.push(veranstaltungWettkaempfeDOLocal);
             console.log(veranstaltungWettkaempfeDOLocal)
           })
         })
       }
     })

    });
    if(this.providedID != null || this.providedID != undefined)
      this.veranstaltungWettkaempfeDO.filter(veranstaltung => veranstaltung.veranstaltungDO.ligaId === this.providedID);
    this.veranstaltungWettkaempfeDO.sort((a,b) => Date.parse(a.wettkaempfeDO.wettkampfDatum) - Date.parse(b.wettkaempfeDO.wettkampfDatum));
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

  public chekIfVeranstaltungskalender(): boolean{
    return this.veranstaltungWettkaempfeDO.length === 0;
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

    console.log("Id der veranstaltung " + this.veranstaltung.id)
    const link = '/wettkaempfe/' + this.veranstaltung.id;
    this.router.navigateByUrl(link);
  }


  //BSAPP-1384
  private getVeranstaltungen(ligaId: number) {
    var veranstaltungsListe = [];

    this.veranstaltungDataProvider.findByLigaId(ligaId)
        .then((response: BogenligaResponse<VeranstaltungDTO[]>) => {

          veranstaltungsListe=response.payload
          if (veranstaltungsListe.length == 1) {
            this.veranstaltung = veranstaltungsListe[0]
          } else {
            this.veranstaltung = veranstaltungsListe.reduce((prev, current) => {
              return (prev.sportjahr > current.sportjahr) ? prev : current;
            })
          }
        })
        .catch((response: BogenligaResponse<VeranstaltungDTO>) => {
          //error
        });
  }


  private handleSuccessfulLogin() {
    this.loadWettkaempfe();
    this.buildVeranstaltungskalender();
  }




}



