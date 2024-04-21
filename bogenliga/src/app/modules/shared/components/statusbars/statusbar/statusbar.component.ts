import {Component, Input, OnInit} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AuthenticationComponent} from '../../../../spotter/components';

@Component({
  selector:    'bla-migrationstatusbar',
  templateUrl: 'statusbar.component.html',
  styleUrls:['statusbar.component.scss'],
  //imports: [MatProgressBarModule]
})

export class StatusbarComponent implements OnInit{
  showProgress: boolean = false;
  @Input() progress!: number;
  @Input() public disabled = false;
  @Input() public loading = false;

  constructor() {
  }

  ngOnInit(): void {
    this.showProgress = true;
  }
  public showStatusBar(){
    this.showProgress = true;
  }
  closeWebSocket() {
    // WebSocket-Verbindung schließen
    this.webSocket.close();
  }
}
