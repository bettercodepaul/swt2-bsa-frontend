import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {UserDataProviderService} from '../../../services/user-data-provider.service';
import {UserDO} from '../../../types/user-do.class';
import {UserRolleDO} from '../../../types/user-rolle-do.class';
import {UserRolleDTO} from '../../../types/datatransfer/user-rolle-dto.class';
import {RoleDTO} from '../../../types/datatransfer/role-dto.class';
import {RoleDO} from '../../../types/role-do.class';
import {USER_DETAIL_CONFIG} from './user-detail.config';
import {TranslatePipe} from '@ngx-translate/core';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RoleVersionedDataObject} from '../../../services/models/roles-versioned-data-object.class';
import {RoleDataProviderService} from '../../../services/role-data-provider.service';
import {CredentialsDTO} from '@user/types/model/credentials-dto.class';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_USER = 'user_detail_save';


@Component({
  selector:    'bla-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls:   ['./user-detail.component.scss'],
  providers:   [TranslatePipe]
})
export class UserDetailComponent extends CommonComponentDirective implements OnInit {
  @Input() public userRoleLeftCaptionTranslationKey = 'MANAGEMENT.USER_DETAIL.FORM.ROLE_NEW.LEFTCAPTION';
  @Input() public userRoleRightCaptionTranslationKey = 'MANAGEMENT.USER_DETAIL.FORM.ROLE_NEW.RIGHTCAPTION';
  @Output() public onAction = new EventEmitter<void>();
  public config = USER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentUserRolleDO: UserRolleDO[];
  public roles: RoleDTO[] = [];
  public tobeRole: RoleDO;
  public currentRoles: UserRolleDTO[] = [];
  public roleNames;
  public resetCredentials: CredentialsDTO;
  public saveLoading = false;
  public savePW = false;
  public enableButton = false;
  public rightList: RoleDTO[] = []; // Objekt zur Anzeige der zukünftigen Rollen auf der Applikation
  public leftList: RoleDTO[] = []; // Objekt zur Anzeige der aller übrigen Rollen auf der Applikation
  public ActionButtonColors = ActionButtonColors;


  private sessionHandling: SessionHandling;

  private notification: Notification = {
    id:          NOTIFICATION_SAVE_USER,
    title:       'MANAGEMENT.USER_DETAIL.NOTIFICATION.UPDATE.TITLE',
    description: 'MANAGEMENT.USER_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION',
    severity:    NotificationSeverity.INFO,
    origin:      NotificationOrigin.USER,
    type:        NotificationType.OK,
    userAction:  NotificationUserAction.PENDING
  };

  constructor(private userDataProvider: UserDataProviderService,
    private roleDataProvider: RoleDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private translate: TranslatePipe,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  /*
  ngOnInit
  ich blocke die Applikation während ich lade
  ich hole mir aus der Datenbank den ausgewählten Nutzer als UserRolleDO
  die derzeitigen Rollen von dem ausgewählten User werden in currentUserRolleDO gespeichert
  alle Rollennamen werden mit | getrennt in das Feld Aktuelle Rollen geschrieben

  ich hole mir aus der Datenbank mit roleDataProvider.findAll alle RoleDO die in der Datenbank vorhanden sind
  und speichere sie in roles ab

  beim ändern der Objekte currentUserRolleDO oder roles wird updateView() aufgerufen
  */
  ngOnInit() {
    this.loading = true;
    this.tobeRole = new RoleDO();
    this.resetCredentials = new CredentialsDTO('', '', null, false, '');
    this.notificationService.discardNotification();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.currentUserRolleDO = [];
        this.currentUserRolleDO.push(new UserRolleDO());

        if (id !== 'add') {
          this.userDataProvider.findUserRoleById(id)
              .then((response: BogenligaResponse<UserRolleDO[]>) => {
                this.currentUserRolleDO = response.payload;
                this.updateView();
                this.roleNames = '';
                for (const role of this.currentUserRolleDO) {
                  this.roleNames += role.roleName + ' | ';
                }
              })
              .catch((response: BogenligaResponse<UserRolleDO>) => this.currentUserRolleDO = null);

          // wir laden hiermit alle möglichen User-Rollen aus dem Backend um die Klappliste für die Auswahl zu befüllen.
          this.roleDataProvider.findAll()
              .then((response: BogenligaResponse<RoleDO[]>) => this.setVersionedDataObjects(response))
              .catch((response: BogenligaResponse<RoleDO[]>) => this.getEmptyList());
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

  /*
   resetPW
   ändert Passworteintrag für ausgewählten User
   */
  public resetPW(ignore: any): void {
    this.savePW = true;
    this.resetCredentials.username = this.currentUserRolleDO[0].email;
    this.userDataProvider.resetPW(this.resetCredentials)
        .then((response: BogenligaResponse<Array<UserDO>>) => {
          if (!isNullOrUndefined(response)) {
            this.notificationService.observeNotification(NOTIFICATION_SAVE_USER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.savePW = false;
                    this.router.navigateByUrl('/verwaltung/user');
                  }
                });
            this.notificationService.showNotification(this.notification);
          }
        }, (response: BogenligaResponse<UserDO>) => {
        console.log('Failed');
        this.savePW = false;
      });

  }

  /*
  resetRole
  aktualisiert Rollen für ausgewählten Nutzer mit den Rollen in rightList
   */
  public resetRole(ignore: any): void {
    this.saveLoading = true;
    // persist
    this.rightList.forEach((item, index) => {

      const currentUserRolleDTO = new UserRolleDTO();
      currentUserRolleDTO.id = this.currentUserRolleDO[0].id;
      currentUserRolleDTO.email = this.currentUserRolleDO[0].email;
      this.tobeRole = this.rightList[index] as RoleDO;
      currentUserRolleDTO.roleId = this.tobeRole.id;
      currentUserRolleDTO.roleName = this.tobeRole.roleName;
      this.currentRoles.push(currentUserRolleDTO);
    });

    this.userDataProvider.updateRole(this.currentRoles)
        .then((response: BogenligaResponse<Array<UserDO>>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload[0])
            && !isNullOrUndefined(response.payload[0].id)) {

            this.notificationService.observeNotification(NOTIFICATION_SAVE_USER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                  }
                });

            this.notificationService.showNotification(this.notification);
            this.router.navigateByUrl('/verwaltung/user');
          }

        }, (response: BogenligaResponse<UserDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }


  public entityExists(): boolean {
    return this.currentUserRolleDO[0].id > 0;
  }

  private handleSuccess(response: BogenligaResponse<UserRolleDO[]>) {
    this.currentUserRolleDO = response.payload;
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<UserRolleDO>) {
    this.loading = false;

  }

  public getEmptyList(): RoleVersionedDataObject[] {
    return [];
  }

  /*
  setVersionedDataObjects
  aktuallisiert Liste aller Rollen aus der Datenbank
   */
  public setVersionedDataObjects(response: BogenligaResponse<RoleDTO[]>): void {
    this.roles = []; // reset array to ensure change detection
    this.loading = false;

    response.payload.forEach((responseItem) => this.roles.push(new RoleVersionedDataObject(responseItem.id, responseItem.roleName)));
    this.updateView();
    return;
  }

  public getVersionedDataObjects() {
    return this.roles;
  }

  /*
  updateView
  ich aktualisiere die Anzeigeobjekte der Applikation indem ich aus der Liste aller Rollen (roles)
  die Liste meiner derzeitigen Rollen (currentUserRolleDO) entferne
   */
  public updateView() {
    let inList = 0;
    this.leftList = [];
    this.rightList = [];
    this.roles.forEach((item) => {
      for (const role of this.currentUserRolleDO) {
        if (role.roleName === item.roleName) {
          inList = 1;
        }
      }
      if (inList === 0) {
        this.leftList.push(item);
      } else {
        this.rightList.push(item);
      }
      inList = 0;
    });

  }

  public getTranslation(key: string) {
    return this.translate.transform(key);
  }
}
