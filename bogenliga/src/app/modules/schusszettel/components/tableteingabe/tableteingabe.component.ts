import {Component, OnInit} from '@angular/core';
import {MatchDO} from '../../types/match-do.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute} from '@angular/router';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {WettkampfDO} from '@vereine/types/wettkampf-do.class';

@Component({
  selector:    'bla-tableteingabe',
  templateUrl: './tableteingabe.component.html',
  styleUrls:   ['./tableteingabe.component.scss']
})
export class TabletEingabeComponent implements OnInit {

  match1: MatchDO;
  match2: MatchDO;
  wettkampf: WettkampfDO;


  constructor(private schusszettelService: SchusszettelProviderService,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
  }

  /**
   * Called when component is initialized.
   */
  ngOnInit() {
    // initialwert schützen inputs

    this.match1 = new MatchDO(null, null, null, 1, 1, 1, 1, [], 1, 1, null, null);
    this.match2 = new MatchDO(null, null, null, 1, 1, 1, 1, [], 1, 1, null, null);

    this.route.params.subscribe((params) => {
      if (!isUndefined(params['match1id']) && !isUndefined(params['match2id'])) {
        const match1id = params['match1id'];
        const match2id = params['match2id'];
        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDO>>) => {
              this.match1 = data.payload[0];
              this.match2 = data.payload[1];
            }, (error) => {
              console.error(error);
            });

      }
    });
  }

  save() {
    this.notificationService.showNotification({
      id:          'schusszettelSave',
      title:       'Lädt...',
      description: 'Schusszettel wird gespeichert...',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    });
    this.schusszettelService.create(this.match1, this.match2)
        .then((data: BogenligaResponse<Array<MatchDO>>) => {
          this.match1 = data.payload[0];
          this.match2 = data.payload[1];
          this.notificationService.discardNotification();
        }, (error) => {
          console.error(error);
          this.notificationService.discardNotification();
        });
  }
}
