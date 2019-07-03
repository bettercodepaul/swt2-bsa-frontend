import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {BogenligaResponse} from '@shared/data-provider';
import {ActivatedRoute} from '@angular/router';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';

const STORAGE_KEY_TABLET_SESSION: string = 'tabletSession';

@Component({
  selector:    'bla-tablet-admin',
  templateUrl: './tablet-admin.component.html',
  styleUrls:   ['./tablet-admin.component.scss']
})
export class TabletAdminComponent implements OnInit {

  sessions: Array<TabletSessionDO>;
  currentDeviceIsActive: boolean = false;

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
              this.currentDeviceIsActive = !!localStorage.getItem(STORAGE_KEY_TABLET_SESSION);
              console.log('LOCALSTORAGE CURRENTDEVICE', this.currentDeviceIsActive);
              if (this.currentDeviceIsActive) {
                const ses = JSON.parse(localStorage.getItem(STORAGE_KEY_TABLET_SESSION));
                this.sessions[ses.scheibenNr - 1] = ses;
              }
            }, (error) => {
              console.error(error);
              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < 8; i++) {
                this.sessions.push(new TabletSessionDO(i+1, parseInt(wettkampfId), false));
              }
              this.currentDeviceIsActive = !!localStorage.getItem(STORAGE_KEY_TABLET_SESSION);
              console.log('LOCALSTORAGE CURRENTDEVICE', this.currentDeviceIsActive);
              if (this.currentDeviceIsActive) {
                const ses = JSON.parse(localStorage.getItem(STORAGE_KEY_TABLET_SESSION));
                this.sessions[ses.scheibenNr - 1] = ses;
              }
            });
      }
    });
  }

  public updateSession(scheibenNr: number) {
    let sessionToUpdate = this.sessions[scheibenNr-1];
    sessionToUpdate.isActive = !sessionToUpdate.isActive;
    if (sessionToUpdate.isActive) {
      localStorage.setItem(STORAGE_KEY_TABLET_SESSION, JSON.stringify(sessionToUpdate));
      this.currentDeviceIsActive = true;
    } else {
      localStorage.removeItem(STORAGE_KEY_TABLET_SESSION);
      this.currentDeviceIsActive = false;
    }
    this.tabletSessionService.update(sessionToUpdate)
      .then((success) => {
        this.sessions[scheibenNr-1] = success.payload;
        if (success.payload.isActive) {
          localStorage.setItem(STORAGE_KEY_TABLET_SESSION, JSON.stringify(success.payload));
          this.currentDeviceIsActive = true;
        } else {
          localStorage.removeItem(STORAGE_KEY_TABLET_SESSION);
          this.currentDeviceIsActive = false;
        }
      }, (error) => {
        console.log(error);
      })
  }
}
