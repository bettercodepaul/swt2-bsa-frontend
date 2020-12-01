import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {EINSTELLUNGEN_DETAIL_CONFIG} from './einstellungen-detail.config';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';


@Component({
  selector: 'bla-einstellungen-detail',
  templateUrl: './einstellungen-detail.component.html',
  styleUrls: ['./einstellungen-detail.component.scss']
})
export class EinstellungenDetailComponent extends CommonComponentDirective implements OnInit {
  public config = EINSTELLUNGEN_DETAIL_CONFIG;
  public ButtonType = ButtonType;

  public deleteLoading = false;
  public saveLoading = false;
  public type = `KREIS`;


  // müssen ersetzt werden
  //public currentMitglied: DsbMitgliedDO = new DsbMitgliedDO();
  //public currentVerein: VereinDO = new VereinDO();
  //public nationen: Array<string> = [];
  //public nationenKuerzel: Array<string> = [];
  //public currentMitgliedNat: string;

@ViewChild('downloadLink')
private aElementRef: ElementRef;
constructor(private dbsProvider: DsbMitgliedDataProviderService) {
  super();
}


  ngOnInit() {
   // this.loading = true;
  //  this.loadingeinstellung(this.type);



  };

  //private loadingeinstellung(type: string){
    //this.dbsProvider.findAll(type)
      //.then((response)=>{
        //this.handle
      //} )
  //}





}


