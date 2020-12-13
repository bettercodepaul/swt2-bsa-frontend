import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';

import {EINSTELLUNGEN_DETAIL_CONFIG} from './einstellungen-detail.config';


import {HttpClient} from '@angular/common/http';
import {

  Notification, NotificationOrigin,
  NotificationService,
  NotificationSeverity, NotificationType,

} from '@shared/services';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {BogenligaResponse} from '@shared/data-provider';

import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';

import {TableRow} from '@shared/components/tables/types/table-row.class';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_UPDATE_EINSTELLUNG = 'einstellung_detail_update';
const NOTIFICATION_SAVE_EINSTELLUNG = 'einstellung_detail_save';
const NOTIFICATION_CREATE_EINSTELLUNG = 'einstellung_detail_save';
@Component({
  selector: 'bla-einstellungen-detail',
  templateUrl: './einstellungen-detail.component.html',
  styleUrls: ['./einstellungen-detail.component.scss']
})
export class EinstellungenDetailComponent extends CommonComponentDirective implements OnInit {
  public config = EINSTELLUNGEN_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentEinstellung: EinstellungenDO = new EinstellungenDO();
  public neucurrentEinstellung: EinstellungenDO = new EinstellungenDO();





  public currentMitgliedNat: string;
  public deleteLoading = false;
  public saveLoading = false;
  public rows: TableRow[];
  public id;
  public test = 'app.bogenliga.frontend.autorefresh.active';


  constructor(private einstellungenDataProvider: EinstellungenProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private einstellungenProviderService: EinstellungenProviderService) {
              super();
  }

  public entityExists(): boolean {
    return this.currentEinstellung.id >= 0;
  }


  public onSave(ignore: any): void {

    this.saveLoading = true;




    this.currentEinstellung.key = this.neucurrentEinstellung.key;

    const notificationSave: Notification = {
      id:          NOTIFICATION_SAVE_EINSTELLUNG,
      title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
      description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,

    };

    this.notificationService.showNotification(notificationSave);





  }


  ngOnInit() {






    this.loading = true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentEinstellung = new EinstellungenDO();

          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {


          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });


  }


  private loadById(id: string) {

    this.einstellungenProviderService.findById(id)
        .then((response: BogenligaResponse<EinstellungenDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<EinstellungenDO>) => this.handleSuccess(response));
  }


  private handleSuccess(response: BogenligaResponse<EinstellungenDO>) {
    this.currentEinstellung = response.payload;
    this.loading = false;


  }




  changevalue($event: MouseEvent) {

    this.saveLoading = true;

    this.currentEinstellung.value = this.neucurrentEinstellung.value;


    this.einstellungenProviderService.update(this.currentEinstellung)
        .then((response: BogenligaResponse<EinstellungenDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
          }


          const notificationUpdate: Notification = {

            id:          NOTIFICATION_UPDATE_EINSTELLUNG,
            title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EDIT.TITLE',
            description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EDIT.DESCRIPTION',
            severity:    NotificationSeverity.INFO,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,

          };

          this.notificationService.showNotification(notificationUpdate);

          const id = this.currentEinstellung.id;

          this.navigateToDetailDialog();

        }, (response: BogenligaResponse<EinstellungenDO>) => {

          this.saveLoading = false;
        });


  }


  createEinstellung($event: MouseEvent) {
    this.saveLoading = true;

    this.einstellungenProviderService.findAll()
        .then((response: BogenligaResponse<EinstellungenDTO[]> ) => this.currentEinstellung.id = response.payload.length + 1);

    this.einstellungenProviderService.create(this.currentEinstellung)
        .then((response: BogenligaResponse<EinstellungenDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const notification: Notification = {
              id:          NOTIFICATION_CREATE_EINSTELLUNG,
              title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,

            };

            this.notificationService.showNotification(notification);


            this.navigateToDetailDialog();


          }
        }, (response: BogenligaResponse<EinstellungenDO> ) => {

          this.saveLoading = false;


        });

  }


  private navigateToDetailDialog() {
    this.router.navigateByUrl('/verwaltung/einstellungen');
  }


}


