import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isUndefined} from '@shared/functions';
import {BogenligaResponse} from '@shared/data-provider';
import {ActivatedRoute} from '@angular/router';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';

export const STORAGE_KEY_TABLET_SESSION: string = 'tabletSession';

const SESSION_INVALID_STORAGE_VALUES = ['[]', 'null', 'undefined'];

@Component({
  selector:    'bla-tablet-admin',
  templateUrl: './tablet-admin.component.html',
  styleUrls:   ['./tablet-admin.component.scss']
})
export class TabletAdminComponent implements OnInit {

  sessions: Array<TabletSessionDO>;
  currentDeviceIsActive: boolean = false;
  currentSession: TabletSessionDO;

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
              /*const activeSessions: Array<TabletSessionDO> = data.payload;
               let allSessions = [];

               for (let activeSession of activeSessions) {
               activeSession.isActive = true;
               allSessions[activeSession.scheibenNr - 1] = activeSession;
               }
               for (let i = 0; i < 8; i++) {
               if (activeSessions[i]) {
               allSessions[activeSessions[i].scheibenNr - 1] = activeSessions[i];
               allSessions[activeSessions[i].scheibenNr - 1].isActive = true;
               } else {
               //allSessions[i] = new TabletSessionDO(i+1, parseInt(wettkampfId));
               //allSessions[i].isActive = false;
               }
               }
               for (let i = 0; i < 8; i++) {
               if (isNullOrUndefined(allSessions[i])) {
               allSessions[i] = new TabletSessionDO(i + 1, parseInt(wettkampfId));
               allSessions[i].isActive = false;
               }
               }
               this.sessions = allSessions;
               */
              this.sessions = data.payload;
              this.setActiveSession();
            }, (error) => {
              console.error(error);
              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < 8; i++) {
                this.sessions.push(new TabletSessionDO(i + 1, parseInt(wettkampfId), false));
              }
              this.setActiveSession();
            });
      }
    });
  }

  private setActiveSession() {
    let currentTabletSession = localStorage.getItem(STORAGE_KEY_TABLET_SESSION);
    this.currentDeviceIsActive = Boolean(currentTabletSession) &&
      SESSION_INVALID_STORAGE_VALUES.indexOf(currentTabletSession) < 0;
    console.log('LOCALSTORAGE CURRENTDEVICE', this.currentDeviceIsActive);
    if (this.currentDeviceIsActive) {
      this.currentSession = JSON.parse(currentTabletSession);
      this.sessions[this.currentSession.scheibenNr - 1] = this.currentSession;
    }
  }

  public updateSession(scheibenNr: number) {
    let sessionToUpdate = this.sessions[scheibenNr - 1];
    sessionToUpdate.isActive = !sessionToUpdate.isActive;
    this.storeCurrentSession(sessionToUpdate);
    this.tabletSessionService.update(sessionToUpdate)
        .then((success) => {
          this.sessions[scheibenNr - 1] = this.currentSession = success.payload;
          this.storeCurrentSession(this.currentSession);
          if (this.currentDeviceIsActive) {
            // TODO link zur Eingabe erstellen und da hin navigieren... Andere MatchID wird noch benötigt...
          }
        }, (error) => {
          console.log(error);
        })
  }

  private storeCurrentSession(session: TabletSessionDO) {
    if (session.isActive) {
      localStorage.setItem(STORAGE_KEY_TABLET_SESSION, JSON.stringify(session));
      this.currentDeviceIsActive = true;
    } else {
      localStorage.removeItem(STORAGE_KEY_TABLET_SESSION);
      this.currentDeviceIsActive = false;
    }
  }
}
