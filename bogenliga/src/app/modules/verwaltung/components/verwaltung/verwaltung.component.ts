import {Component, OnInit} from '@angular/core';
import {VERWALTUNG_CONFIG} from './verwaltung.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService} from '@shared/services';

@Component({
  selector:    'bla-verwaltung',
  templateUrl: './verwaltung.component.html',
  styleUrls:   ['./verwaltung.component.scss']
})

export class VerwaltungComponent implements OnInit {
  public config = VERWALTUNG_CONFIG;
  private sessionHandling: SessionHandling;

  constructor(private currentUserService: CurrentUserService) {
    this.sessionHandling = new SessionHandling(this.currentUserService);
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
