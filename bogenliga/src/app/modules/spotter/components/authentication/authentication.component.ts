import {Component, OnInit} from '@angular/core';
import {ButtonSize} from '@shared/components';

// new CM
// import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '@sportjahresplan/types/tablet-session-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {ActivatedRoute, Router} from '@angular/router';
import {TabletSessionProviderService} from '@sportjahresplan/services/tablet-session-provider.service';



@Component({
  selector: 'bla-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent implements OnInit {

  constructor(private tabletSessionService: TabletSessionProviderService, private route: ActivatedRoute, private router: Router) {}

  sessions: Array<TabletSessionDO>;
  currentSession: TabletSessionDO;
  tokens = [];
  accessTokenInput: string;
  public ButtonSize = ButtonSize;

  ngOnInit() {
    this.tabletSessionService.findAllTabletSessionswithoutArgument()
      .then((data: BogenligaResponse<Array<TabletSessionDO>>) => {
        this.sessions = data.payload;
        for (let i = 0 ; i <= this.sessions.length; i++) {
          this.tokens[i] = this.sessions[i].accessToken.toString();
        }
      }, (error) => {
        console.error(error);
      });
  }

  public validateAccessToken() {
    for (let i = 0; i <= (this.tokens.length - 1); i++) {
      if (this.accessTokenInput === this.tokens[i]) {
        this.router.navigateByUrl('/spotter');
      }
    }
  }
}
