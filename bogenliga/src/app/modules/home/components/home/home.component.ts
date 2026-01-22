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
import { RecentLigaService, RecentLigaEntry } from '@shared/services';
import { slugifyLigaName } from '@shared/functions/slug-utils';

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
import {distinctUntilChanged, map} from "rxjs/operators";


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
  public rows: TableRow[] = [];
  public veranstaltungWettkaempfeDO: VeranstaltungWettkaempfe[] = [];
  public veranstaltungWettkaempfeyear: number;
  public recentLigas: RecentLigaEntry[] = [];
  public ligaSelected = false;
  public VereinsID: number;
  public ligaName: string;
  private sessionHandling: SessionHandling;
  private routeSubscription: Subscription;
  public veranstaltung: VeranstaltungDO;
  public currentSportjahr: number;

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
    private selectedLigaDataprovider: SelectedLigaDataprovider,
    private recentLigaService: RecentLigaService) {
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
    // 1) Login sicherstellen (Default-User bei Public View)
    if (!this.currentUserService.isLoggedIn()) {
      try {
        await this.logindataprovider.signInDefaultUser();
      } catch (e) {
        // Optional: Logging / Silent fail
        console.warn('Default sign-in failed', e);
      }
    }

    // 2) Initiale Daten laden (Wettkämpfe, Veranstaltungen, VereinsID)
    this.setCorrectID();

    // 3) Zuletzt angesehene Ligen laden (LocalStorage)
    this.recentLigas = this.recentLigaService.getAll();

    // 4) Aktuelles Sportjahr laden
    await this.setCurrentSportjahr();

    // 5) Liga aus dem Resolver beobachten.
    // Der Resolver wird durch runGuardsAndResolvers:'paramsOrQueryParamsChange' bei
    // jedem Wechsel von ?liga=... erneut ausgeführt. Wir reagieren hier nur auf echte Änderungen.
    this.routeSubscription = this.route.data
      .pipe(
        map(d => d['liga'] as LigaDO | null),
        distinctUntilChanged((a, b) => a?.id === b?.id)
      )
      .subscribe(liga => {
        if (liga && liga.id != null) {
          this.applyLiga(liga);
        } else {
          this.clearLigaSelection();
        }
      });
  }


  /**unsubscribe to avoid memory leaks*/
  ngOnDestroy() {
    // Einziger notwendiger Cleanup: Subscription auf route.data
    this.routeSubscription?.unsubscribe();
  }

  private applyLiga(liga: LigaDO): void {
    this.selectedLigaName               = liga.name;
    this.selectedLigaID                 = liga.id;
    this.selectedLigaDetails            = liga.ligaDetail;
    this.selectedLigaDetailBase64       = liga.ligaDetailFileBase64;
    this.selectedLigaDetailFileName     = liga.ligaDetailFileName;
    this.selectedLigaDetailFileType     = liga.ligaDetailFileType;
    this.ligaSelected                   = true;
    this.recentLigaService.add({ id: liga.id, name: liga.name });
    this.recentLigas = this.recentLigaService.getAll();
    this.getWettkampfTableContent();
  }

  private clearLigaSelection(): void {
    this.selectedLigaID = null;
    this.selectedLigaName = null;
    this.selectedLigaDetails = null;
    this.selectedLigaDetailBase64 = null;
    this.selectedLigaDetailFileName = null;
    this.selectedLigaDetailFileType = null;
    this.ligaSelected = false;

    this.getWettkampfTableContent();
  }

  public deselect() {
    this.router.navigate(['/home'], { queryParams: {} });
    this.clearLigaSelection();
  }

  // Ergänze in der Klasse:
  public getLigaQueryParam(entry: { id: number; name: string; slug?: string }): string {
    const slug = entry.slug || slugifyLigaName(entry.name ?? '');
    return slug || String(entry.id);
  }

  /**File Download, converts Base64 string back to its original file with its original name*/
  public fileDownload(){
    //typeOfFile wirft Fehler, weil die variablen NULL sind.
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


  private async handleSuccessLoadWettkaempfe(payload: WettkampfDTO[]): Promise<void> {
    this.wettkaempfeDTO = payload;

    // Alle Veranstaltungen zu den Wettkämpfen laden und kombinieren
    const combined = await Promise.all(
      this.wettkaempfeDTO.map(async (wettkampf) => {
        try {
          const response = await this.veranstaltungDataProvider.findById(wettkampf.wettkampfVeranstaltungsId);
          const veranstaltung = response.payload as VeranstaltungDO;

          const monthNum = parseInt(wettkampf.wettkampfDatum.split('-')[1], 10);
          const dayNum = parseInt(wettkampf.wettkampfDatum.split('-')[2], 10);

          const item: VeranstaltungWettkaempfe = {
            wettkaempfeDO: wettkampf as unknown as WettkampfDO,
            veranstaltungDO: veranstaltung,
            month: this.numberToMonth(monthNum),
            day: dayNum
          };
          return item;
        } catch (e) {
          console.log('Veranstaltung not Found');
          return null;
        }
      })
    );

    // Nur gültige Einträge übernehmen und nach Datum sortieren
    this.veranstaltungWettkaempfeDO = combined
      .filter((x): x is VeranstaltungWettkaempfe => x !== null)
      .sort((a, b) => Date.parse(a.wettkaempfeDO.wettkampfDatum) - Date.parse(b.wettkaempfeDO.wettkampfDatum));
  }


  //get current sportjahr from einstellungen
  private async setCurrentSportjahr(): Promise<void> {
    await this.einstellungenDataProvider.findAll().then((x: BogenligaResponse<EinstellungenDO[]>) => {
      let sportJahrDo = x.payload.filter(x => x.key == 'aktives-Sportjahr')[0];
      this.currentSportjahr = parseInt(sportJahrDo.value);
  });
  }

  //fills the table for Wettkämpfe on home page
  private async getWettkampfTableContent(): Promise<void> {
    this.veranstaltungDO = [];
    this.veranstaltungWettkaempfeDO = [];

    console.log('Wettkämpfe laden Timestamp:'+ Date.now());

    if (this.selectedLigaID == null) {
      this.wettkampfDataProvider.findFutureSix()
        .then((response: BogenligaResponse<WettkampfDTO[]>) => {
          this.handleSuccessLoadWettkaempfe(response.payload);
        })
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => {
          this.wettkaempfeDTO = response.payload;
        });
    }else {
      await this.findByVeranstalungsIds()
    }
    console.log('Wettkämpfe für Liga geladen Timestamp:'+ Date.now());
  }

  private async findByVeranstalungsIds(): Promise<void> {
    try {
      // EIN EINZIGER Backend-Call!
      const response = await this.wettkampfDataProvider.findByLigaIdWithVeranstaltung(
        this.selectedLigaID
      );

      const wettkaempfe = response.payload;

      if (! wettkaempfe || wettkaempfe.length === 0) {
        console.log("No wettkämpfe found for liga.");
        return;
      }

      // Jahr aus dem ersten Wettkampf holen
      this.veranstaltungWettkaempfeyear = wettkaempfe[0].veranstaltungSportjahr;
      console.log(wettkaempfe);
      // Direkt die Daten vom Backend verwenden - ALLE Felder sind jetzt vorhanden!
      wettkaempfe.forEach((wk: any) => {
        const wettkampfDO = new WettkampfDO(
          wk.wettkampfId,
          wk.veranstaltungId,
          wk.wettkampfDatum,
          wk.wettkampfStrasse,
          wk.wettkampfPlz,
          wk.wettkampfOrtsname,
          wk.wettkampfOrtsinfo,
          wk.wettkampfBeginn,
          wk.wettkampfTag,
          wk.wettkampfDisziplinId,
          wk.wettkampfTypId,
          null,                       // version (nicht benötigt)
          wk.wettkampfAusrichter
        );

        const veranstaltungWettkaempfeDOLocal:  VeranstaltungWettkaempfe = {
          wettkaempfeDO: wettkampfDO,
          veranstaltungDO: {
            id: wk.veranstaltungId,
            name: wk.veranstaltungName,
            sportjahr: wk.veranstaltungSportjahr,
            ligaId: wk.veranstaltungLigaId,
            ligaName: wk.veranstaltungLigaName
          } as VeranstaltungDO,
          month: this.numberToMonth(parseInt(wk.wettkampfDatum. split("-")[1])),
          day: parseInt(wk.wettkampfDatum.split("-")[2])
        };
        this.veranstaltungWettkaempfeDO. push(veranstaltungWettkaempfeDOLocal);
      });

      // Bereits vom Backend sortiert, aber zur Sicherheit:
      this.veranstaltungWettkaempfeDO.sort((a,b) =>
        Date.parse(a.wettkaempfeDO.wettkampfDatum) - Date.parse(b.wettkaempfeDO.wettkampfDatum)
      );

    } catch (e) {
      console.error(e);
    }
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

  public chekIfVeranstaltungskalender(): boolean{
    return this.veranstaltungWettkaempfeDO.length === 0;
  }


  public wettkampfErgebnisseLinking() {
    this.router.navigate(
      ['/wettkaempfe', this.veranstaltung.id],
      { queryParamsHandling: 'merge' }
    );
  }

  public wettkampfButtonToLigatabelleLinking(
    ligaId: number,
    ligaName?: string,
    veranstaltungId?: number,
    wettkampfId?: number
  ) {
    const ligaParam = ligaName ? slugifyLigaName(ligaName) : String(ligaId);
    console.log("VeranstaldunId" + veranstaltungId);
    console.log("WettkampfId" + wettkampfId);

    this.router.navigate(
      ['/ligatabelle'],
      {
        queryParams: { liga: ligaParam },
        queryParamsHandling: 'merge',
        state: {
          initialVeranstaltungId: veranstaltungId,
          initialWettkampfId: wettkampfId
        }
      }
    );
  }


}



