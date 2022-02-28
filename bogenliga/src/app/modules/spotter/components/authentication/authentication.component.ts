import { Component, OnInit } from '@angular/core';
import { ButtonSize } from '@shared/components';
import { TabletSessionDO } from '../../../wkdurchfuehrung/types/tablet-session-do.class';
import { BogenligaResponse } from '@shared/data-provider';
import { ActivatedRoute, Router } from '@angular/router';
import { TabletSessionProviderService } from '../../../wkdurchfuehrung/services/tablet-session-provider.service';

@Component({
  selector: 'bla-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent implements OnInit {

  constructor(private tabletSessionService: TabletSessionProviderService, private route: ActivatedRoute, private router: Router) { }

  sessions: Array<TabletSessionDO>;
  currentSession: TabletSessionDO;
  tokens = [];
  accessTokenInput: string;
  public ButtonSize = ButtonSize;

  ngOnInit() {
    this.tabletSessionService.findAllTabletSessionswithoutArgument()
      .then((data: BogenligaResponse<Array<TabletSessionDO>>) => {
        this.sessions = data.payload;
        for (const session of this.sessions) {
          if (session.accessToken) {
            this.tokens.push(session.accessToken.toString());
          }

        }
      }, (error) => {
        console.error(error);
      });
  }

  public validateAccessToken() {
    for (const token of this.tokens) {
      if (token && this.accessTokenInput === token) {
        this.router.navigateByUrl('/spotter');
      }
    }
  }
}
