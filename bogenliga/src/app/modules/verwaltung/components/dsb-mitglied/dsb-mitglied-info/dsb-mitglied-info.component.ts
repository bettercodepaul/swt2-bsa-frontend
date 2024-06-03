import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {NotificationService} from '../../../../shared/services/notification';
import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {DSB_MITGLIED_INFO_CONFIG} from './dsb-mitglied-info.config';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {HttpClient} from '@angular/common/http';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {SessionHandling} from '@shared/event-handling';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


const ID_PATH_PARAM = 'id';


@Component({
  selector: 'bla-dsb-mitglied-info',
  templateUrl: './dsb-mitglied-info.component.html',
  styleUrls: ['./dsb-mitglied-info.component.scss']
})
export class DsbMitgliedInfoComponent extends CommonComponentDirective implements OnInit {

  public config = DSB_MITGLIED_INFO_CONFIG;
  public ButtonType = ButtonType;
  public currentMitglied: DsbMitgliedDO = new DsbMitgliedDO();
  public currentVerein: VereinDO = new VereinDO();
  // public vereine: Array<VereinDO> = [new VereinDO()];
  public vereine: VereinDO[];
  // public currentVerein: VereinDO;

  public dsbMitgliedNationalitaet: string[];
  public loadingVereine = true;

  public vereineLoaded;

  public nationen: Array<string> = [];
  public nationenKuerzel: Array<string> = [];
  public currentMitgliedNat: string;
  public deleteLoading = false;
  public saveLoading = false;
  public ActionButtonColors = ActionButtonColors;


  private sessionHandling: SessionHandling;

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private vereinDataProvider: VereinDataProviderService,
    private httpService: HttpClient,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService
  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  async ngOnInit() {
    this.loading = true;
    await this.loadVereine();
    this.notificationService.discardNotification();

    this.httpService.get('./assets/i18n/Nationalitaeten.json').subscribe(
      (data) => {
        const json = JSON.parse(JSON.stringify(data));
        json['NATIONEN'].forEach((t) => {
          this.nationen.push(t['name']);
        });

        json['NATIONEN'].forEach((t) => {
          this.nationenKuerzel.push(t['code']);
        });
      }
    );

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentMitglied = new DsbMitgliedDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
          this.currentMitgliedNat = 'Germany';
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }



  private loadById(id: number) {
    this.dsbMitgliedDataProvider.findById(id)
      .then((response: BogenligaResponse<DsbMitgliedDO>) => this.handleSuccess(response))
      .catch((response: BogenligaResponse<DsbMitgliedDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<DsbMitgliedDO>) {
    this.currentMitglied = response.payload;
    this.loading = false;
    const kuer = this.currentMitglied.nationalitaet;
    for (let i = 0; i < this.nationenKuerzel.length; i++) {
      if (this.nationenKuerzel[i] === kuer) {
        this.currentMitgliedNat = this.nationen[i].toString();
      }
    }
    this.vereine.forEach((verein) => {
      if (verein.id === this.currentMitglied.vereinsId) {
        this.currentVerein = verein;

      }
    });
  }

  private handleFailure(response: BogenligaResponse<DsbMitgliedDO>) {
    this.loading = false;

  }


  private loadVereine(): Promise<void> {
    this.vereine = [];
    return this.vereinDataProvider.findAll()
      .then((response: BogenligaResponse<VereinDTO[]>) => {
        if (this.currentUserService.hasPermission(UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER)) {
          response.payload = response.payload.filter((entry) => this.currentUserService.getVerein() === entry.id);
        }
        // this.currentVerein = response.payload[0];
        this.vereine = response.payload;
        this.loadingVereine = false;
        this.vereineLoaded = true;
      })
      .catch((response: BogenligaResponse<VereinDTO[]>) => {
        this.vereine = response.payload;
      });
  }
}
