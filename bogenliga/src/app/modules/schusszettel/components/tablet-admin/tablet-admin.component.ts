import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
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
              const activeSessions = data.payload;
              let allSessions = [];

              for (let activeSession of activeSessions) {
                activeSession.isActive = true;
                allSessions[activeSession.scheibenNr - 1] = activeSession;
              }

             /* for (let i = 0; i < 8; i++) {
                if (activeSessions[i]) {
                  allSessions[activeSessions[i].scheibenNr - 1] = activeSessions[i];
                  allSessions[activeSessions[i].scheibenNr - 1].isActive = true;
                } else {
                  //allSessions[i] = new TabletSessionDO(i+1, parseInt(wettkampfId));
                  //allSessions[i].isActive = false;
                }
              }*/
              for (let i = 0; i < 8; i++) {
                if (isNullOrUndefined(allSessions[i])) {
                  allSessions[i] = new TabletSessionDO(i+1, parseInt(wettkampfId));
                  allSessions[i].isActive = false;
                }
              }
              this.sessions = allSessions;

              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < 8; i++) {
                this.sessions.push(new TabletSessionDO(i+1, parseInt(wettkampfId), false));
              }
            }, (error) => {
              console.error(error);
              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < 8; i++) {
                this.sessions.push(new TabletSessionDO(i+1, parseInt(wettkampfId), false));
              }
            });
      }
    });


  }

  public updateSession(scheibenNr: number) {
    let sessionToUpdate = this.sessions[scheibenNr-1];
    sessionToUpdate.isActive = !sessionToUpdate.isActive;
    this.tabletSessionService.update(sessionToUpdate)
      .then((success) => {
        this.sessions[scheibenNr-1] = success.payload;
      }, (error) => {
        console.log(error);
      })
  }

}
