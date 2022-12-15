import {Component, OnInit} from '@angular/core';
import {IMPRESSUM_CONFIG} from './impressum.config';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {SessionHandling} from '@shared/event-handling';

@Component({
  selector:    'bla-impressum',
  templateUrl: './impressum.component.html',
  styleUrls:   ['./impressum.component.scss']
})
export class ImpressumComponent implements OnInit {

  private sessionHandling: SessionHandling;

  public config = IMPRESSUM_CONFIG;

  constructor(private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

}
