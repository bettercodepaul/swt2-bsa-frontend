import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {UserProfileDataProviderService} from '../../../../user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '../../../../user/types/model/user-profile-dto.class';
import {UserProfileDO} from '../../../../user/types/user-profile-do.class';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {LigaDO} from '../../../types/liga-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {LIGA_DETAIL_CONFIG} from './liga-detail.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {DisziplinDO} from '@verwaltung/types/disziplin-do.class';
import {DisziplinDTO} from '@verwaltung/types/datatransfer/disziplin-dto.class';
import {DisziplinDataProviderService} from '@verwaltung/services/disziplin-data-provider-service';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {HttpClient} from '@angular/common/http';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_LIGA = 'liga_detail_delete';
const NOTIFICATION_DELETE_LIGA_SUCCESS = 'liga_detail_delete_success';
const NOTIFICATION_DELETE_LIGA_FAILURE = 'liga_detail_delete_failure';
const NOTIFICATION_SAVE_LIGA = 'liga_detail_save';
const NOTIFICATION_UPDATE_LIGA = 'liga_detail_update';

@Component({
  selector:    'bla-liga-detail',
  templateUrl: './liga-detail.component.html',
  styleUrls:   ['./liga-detail.component.scss']
})
export class LigaDetailComponent extends CommonComponentDirective implements OnInit {
  public config = LIGA_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentLiga: LigaDO = new LigaDO();
  public ActionButtonColors = ActionButtonColors;


  public currentUbergeordneteLiga: LigaDO = new LigaDO();
  public allUebergeordnete: Array<LigaDO> = [new LigaDO()];

  public currentDisziplin: DisziplinDO = new DisziplinDO();
  public allDisziplin: Array<DisziplinDO> = [new DisziplinDO()];

  public currentRegion: RegionDO = new RegionDO();
  public regionen: Array<RegionDO> = [new RegionDO()];

  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public isAdmin: Boolean = false;


  public deleteLoading = false;
  public saveLoading = false;

  public id;
  private sessionHandling: SessionHandling;


  //FileUpload

  public fileName = '';




  constructor(private ligaDataProvider: LigaDataProviderService,
              private regionProvider: RegionDataProviderService,
              private userProvider: UserProfileDataProviderService,
              private userDataProviderService: UserDataProviderService,
              private disziplinDataProvider: DisziplinDataProviderService,
              private router: Router, private route: ActivatedRoute,
              private notificationService: NotificationService,
              private currentUserService: CurrentUserService,
              private onOfflineService: OnOfflineService,

              //FileUpload
              private http: HttpClient) {
              super();
              this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {

    this.userDataProviderService.findUserRoleById(this.currentUserService.getCurrentUserID()).then((roleresponse: BogenligaResponse<UserRolleDO[]>) => {
      this.isAdmin = roleresponse.payload.filter(role => role.roleName == 'ADMIN').length > 0
    })
    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentLiga = new LigaDO();

          this.loadDisziplin();
          this.loadUebergeordnete(); // additional Request for all 'liga' to get all uebergeordnete
          this.loadRegions(); // Request all regions from backend
          this.loadUsers();

          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
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

  public onSave(ignore: any): void {
    this.saveLoading = true;


    if (typeof this.currentUbergeordneteLiga === 'undefined') {
      this.currentLiga.ligaUebergeordnetId = null;
    } else {
      this.currentLiga.ligaUebergeordnetId = this.currentUbergeordneteLiga.id;
    }

    console.log(this.currentRegion.regionName);
    if (typeof this.currentRegion  === 'undefined') {
      this.currentLiga.regionId = null;
    } else {
      this.currentLiga.regionId = this.currentRegion.id;
    }

    if (typeof this.currentDisziplin  === 'undefined') {
      this.currentLiga.disziplinId = null;
    } else {
      this.currentLiga.disziplinId = this.currentDisziplin.id;
    }

    if (typeof this.currentUser  === 'undefined') {
      this.currentLiga.ligaVerantwortlichId = null;
    } else {
      this.currentLiga.ligaVerantwortlichId = this.currentUser.id;
    }


    if(this.currentLiga.name.includes("_")){
      this.notificationService.showNotification({
        id: 'MaxWordsWarning',
        description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.WRONG_FORMAT.DESCRIPTION',
        title: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.WRONG_FORMAT.TITLE',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.PENDING,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO,
      });
      return
    }

    // persist
    this.ligaDataProvider.create(this.currentLiga)
        .then((response: BogenligaResponse<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_LIGA,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_LIGA)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;

        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    if (this.currentLiga.ligaDetail.length > 5000) {
      this.notificationService.showNotification({
        id: 'MaxWordsWarning',
        description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.MAX_WORDS_SURPASSED.DESCRIPTION',
        title: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.MAX_WORDS_SURPASSED.TITLE',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.PENDING,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO,
      });
      return
    }

    this.saveLoading = true;
    this.currentLiga.regionId = this.currentRegion.id;
    this.currentLiga.disziplinId = this.currentDisziplin.id;
    this.currentLiga.ligaUebergeordnetId = this.currentUbergeordneteLiga.id;
    this.currentLiga.ligaVerantwortlichId = this.currentUser.id;
    // persist
    this.ligaDataProvider.update(this.currentLiga)
        .then((response: BogenligaResponse<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentLiga.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_LIGA + id,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_LIGA + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga');
                  }
                });

            this.notificationService.showNotification(notification);
            this.saveLoading = false;
          }
        }, (response: BogenligaResponse<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }

//File Upload
  public onFileSelected(event){
    const file:File = event.target.files[0];

    if(file){

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }
  }




  // File Upload button, converts selected files to Base64 String
  public convertFileToBase64($event): void {
    this.readThis($event.target);
  }

  public readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    this.currentLiga.ligaDetailFileType = file.type;
    this.currentLiga.ligaDetailFileName = file.name
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.currentLiga.ligaDetailFileBase64 = String(myReader.result);
    };

    myReader.readAsDataURL(file);
  }


  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentLiga.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_LIGA + id,
      title:            'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.ligaDataProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentLiga.id >= 0;
  }

  private loadById(id: number) {
    this.ligaDataProvider.findById(id)
        .then((response: BogenligaResponse<LigaDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<LigaDO>) => this.handleFailure(response));
  }

  private loadDisziplin() {
    this.disziplinDataProvider.findAll()
        .then((response: BogenligaResponse<DisziplinDO[]>) => this.handleDisziplinResponseArraySuccess(response))
        .catch((response: BogenligaResponse<DisziplinDTO[]>) => this.handleDisziplinResponseArrayFailure(response));
  }

  private loadRegions() {
    this.regionProvider.findAll()
      .then((response: BogenligaResponse<RegionDO[]>) => this.handleResponseArraySuccess(response))
      .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleResponseArrayFailure(response));
  }

  private loadUebergeordnete() {
    this.ligaDataProvider.findAll()
      .then((response: BogenligaResponse<LigaDO[]>) => this.handlUebergeordnetResponseArraySuccess (response))
      .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleUebergeordnetResponseArrayFailure (response));
  }

  private loadUsers() {
    this.userProvider.findAll()
        .then( (response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess (response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure (response));
  }

  private handleSuccess(response: BogenligaResponse<LigaDO>) {
    if (this.id !== 'add' && response.payload.disziplinId !== 0) {
      var indexOfDisziplinStart = response.payload.name.lastIndexOf(" ");
      response.payload.name = response.payload.name.substring(0,indexOfDisziplinStart);
    }
    this.currentLiga = response.payload;
    this.loading = false;

    this.loadDisziplin();
    this.loadUebergeordnete(); // additional Request for all 'liga' to get all uebergeordnete
    this.loadRegions(); // Request all regions from backend
    this.loadUsers();
  }

  private handleFailure(response: BogenligaResponse<LigaDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_SUCCESS,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/liga');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_FAILURE,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDisziplinResponseArraySuccess(response: BogenligaResponse<DisziplinDO[]>): void {
    this.allDisziplin = [];
    this.allDisziplin = response.payload;
    console.log(this.allDisziplin);
    if (this.id === 'add') {
      this.currentDisziplin = this.allDisziplin[0];
    } else {
      this.currentDisziplin = this.allDisziplin.filter((disziplin) => disziplin.id === this.currentLiga.disziplinId)[0];
    }
    this.loading = false;
  }

  private handleDisziplinResponseArrayFailure(response: BogenligaResponse<DisziplinDTO[]>): void {
    this.allDisziplin = [];
    this.loading = false;
  }

  private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.regionen = [];
    this.regionen = response.payload;
    if (this.id === 'add') {
      this.currentRegion = this.regionen[0];
    } else {
      this.currentRegion = this.regionen.filter((region) => region.id === this.currentLiga.regionId)[0];
    }
    this.loading = false;
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handlUebergeordnetResponseArraySuccess(response: BogenligaResponse<LigaDO[]>): void {
    this.allUebergeordnete = [];
    this.allUebergeordnete = response.payload.filter((ubergeordneteLiga) => {
      if (ubergeordneteLiga.name != this.currentLiga.name) {
        return ubergeordneteLiga.name;
      }
    });
    if (this.id === 'add') {
      this.currentUbergeordneteLiga = this.allUebergeordnete[0];
    } else {
      this.currentUbergeordneteLiga = this.allUebergeordnete.filter((uebergeordnet) => uebergeordnet.id === this.currentLiga.ligaUebergeordnetId)[0];
    }
    this.loading = false;
  }

  private handleUebergeordnetResponseArrayFailure(response: BogenligaResponse<LigaDTO[]>): void {
    this.allUebergeordnete = [];
    this.loading = false;
  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentLiga.ligaVerantwortlichId)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }
}
