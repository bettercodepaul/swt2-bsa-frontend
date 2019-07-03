import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isUndefined} from '@shared/functions';
import {BogenligaResponse} from '@shared/data-provider';
import {MatchDO} from '../../types/match-do.class';
import {ActivatedRoute} from '@angular/router';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';


@Component({
  selector:    'bla-tablet-admin',
  templateUrl: './tablet-admin.component.html',
  styleUrls:   ['./tablet-admin.component.scss']
})
export class TabletAdminComponent implements OnInit {

  sessions: Array<TabletSessionDO>;

  constructor(private route: ActivatedRoute,
              private tabletSessionService: TabletSessionProviderService) {
  }

  /**
   * Called when component is initialized.
   *
   */
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params['wettkampfId'])) {
        const wettkampfId = params['wettkampfId'];
        this.tabletSessionService.findAllTabletSessions(wettkampfId)
            .then((data: BogenligaResponse<Array<TabletSessionDO>>) => {
              this.sessions = data.payload;
            }, (error) => {
              console.error(error);
            });
      }
    });

    this.sessions = [];
    for (let i = 0; i < 8; i++) {
      this.sessions.push(new TabletSessionDO(i+1, 1000, 1, 1030));
      this.sessions[i].isActive = false;
    }
  }

}
