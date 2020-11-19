import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {BenutzerDO} from '../../../types/benutzer-do.class';
import {BenutzerRolleDO} from '../../../types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '../../../types/datatransfer/benutzer-rolle-dto.class';
import {RoleDTO} from '../../../types/datatransfer/role-dto.class';
import {RoleDO} from '../../../types/role-do.class';
import {BENUTZER_DETAIL_CONFIG} from './benutzer-detail.config';

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

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_BENUTZER = 'benutzer_detail_save';


@Component({
  selector:    'bla-benutzer-detail',
  templateUrl: './benutzer-detail.component.html',
  styleUrls:   ['./benutzer-detail.component.scss']
})
export class BenutzerDetailComponent extends CommonComponentDirective implements OnInit {

  @Output() public onAction = new EventEmitter<void>();
  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzerRolleDO: BenutzerRolleDO[];
  public roles: RoleDTO[] = [];
  public tobeRole: RoleDO;
  public currentRoles: BenutzerRolleDTO[] = [];
  public roleNames;
  public resetCredentials: CredentialsDTO;
  public saveLoading = false;
  public savePW = false;
  public enableButton = false;
  public rightList: RoleDTO[] = []; // Objekt zur Anzeige der zukünftigen Rollen auf der Applikation
  public leftList: RoleDTO[] = []; // Objekt zur Anzeige der aller übrigen Rollen auf der Applikation

  private notification: Notification = {
    id:          NOTIFICATION_SAVE_BENUTZER,
    title:       'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.TITLE',
    description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION',
    severity:    NotificationSeverity.INFO,
    origin:      NotificationOrigin.USER,
    type:        NotificationType.OK,
    userAction:  NotificationUserAction.PENDING
  };

  constructor(private benutzerDataProvider: BenutzerDataProviderService,
              private roleDataProvider: RoleDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  /*
  ngOnInit
  ich blocke die Applikation während ich lade
  ich hole mir aus der Datenbank den ausgewählten Nutzer als BenutzerRolleDO
  die derzeitigen Rollen von dem ausgewählten Benutzer werden in currentBenutzerRolleDO gespeichert
  alle Rollennamen werden mit | getrennt in das Feld Aktuelle Rollen geschrieben

  ich hole mir aus der Datenbank mit roleDataProvider.findAll alle RoleDO die in der Datenbank vorhanden sind
  und speichere sie in roles ab

  beim ändern der Objekte currentBenutzerRolleDO oder roles wird updateView() aufgerufen
  */
  ngOnInit() {
    this.loading = true;
    this.tobeRole = new RoleDO();
    this.resetCredentials = new CredentialsDTO('', '', null, false, '');
    this.notificationService.discardNotification();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.currentBenutzerRolleDO = [];
        this.currentBenutzerRolleDO.push(new BenutzerRolleDO());

        if (id !== 'add') {
          this.benutzerDataProvider.findUserRoleById(id)
              .then((response: BogenligaResponse<BenutzerRolleDO[]>) => {
                this.currentBenutzerRolleDO = response.payload;
                this.updateView();
                this.roleNames = '';
                for (const role of this.currentBenutzerRolleDO) {
                  this.roleNames += role.roleName + ' | ';
                }
              })
              .catch((response: BogenligaResponse<BenutzerRolleDO>) => this.currentBenutzerRolleDO = null);

          // wir laden hiermit alle möglichen User-Rollen aus dem Backend um die Klappliste für die Auswahl zu befüllen.
          this.roleDataProvider.findAll()
              .then((response: BogenligaResponse<RoleDO[]>) => this.setVersionedDataObjects(response))
              .catch((response: BogenligaResponse<RoleDO[]>) => this.getEmptyList());
        }
      }
    });

  }

  /*
  resetPW
  ändert Passworteintrag für ausgewählten Nutzer
   */
  public resetPW(ignore: any): void {
    this.savePW = true;
    this.resetCredentials.username = this.currentBenutzerRolleDO[0].email;
    this.benutzerDataProvider.resetPW(this.resetCredentials)
      .then((response: BogenligaResponse<Array<BenutzerDO>>) => {
        if (!isNullOrUndefined(response)) {
          this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
              .subscribe((myNotification) => {
                if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                  this.savePW = false;
                  this.router.navigateByUrl('/verwaltung/benutzer');
                }
              });
          this.notificationService.showNotification(this.notification);
        }
        }, (response: BogenligaResponse<BenutzerDO>) => {
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

      const currentBenutzerRolleDTO = new BenutzerRolleDTO();
      currentBenutzerRolleDTO.id = this.currentBenutzerRolleDO[0].id;
      currentBenutzerRolleDTO.email = this.currentBenutzerRolleDO[0].email;
      this.tobeRole = this.rightList[index] as RoleDO;
      currentBenutzerRolleDTO.roleId = this.tobeRole.id;
      currentBenutzerRolleDTO.roleName = this.tobeRole.roleName;
      this.currentRoles.push(currentBenutzerRolleDTO);
    });

    this.benutzerDataProvider.updateRole(this.currentRoles)
        .then((response: BogenligaResponse<Array<BenutzerDO>>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload[0])
            && !isNullOrUndefined(response.payload[0].id)) {

            this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/benutzer');
                  }
                });

            this.notificationService.showNotification(this.notification);
          }

        }, (response: BogenligaResponse<BenutzerDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }


  public entityExists(): boolean {
    return this.currentBenutzerRolleDO[0].id > 0;
  }

  private loadById(id: number) {
    this.benutzerDataProvider.findUserRoleById(id)
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<BenutzerRolleDO[]>) {
    this.currentBenutzerRolleDO = response.payload;
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<BenutzerRolleDO>) {
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
  die Liste meiner derzeitigen Rollen (currentBenutzerRolleDO) entferne
   */
  public updateView() {
    let inList = 0;
    this.leftList = [];
    this.rightList = [];
    this.roles.forEach((item, index) => {
      for (const role of this.currentBenutzerRolleDO) {
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

}
