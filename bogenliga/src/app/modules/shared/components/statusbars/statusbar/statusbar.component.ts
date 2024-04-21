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
  title='Websocketclient';
  showProgress: boolean = false;
  @Input() progress!: number;
  @Input() public disabled = false;
  @Input() public loading = false;
  @Input() public isMigrationStatusBar = false;
  message: any ={};
  private webSocket : WebSocket;

  constructor() {
    this.webSocket = new WebSocket('ws://localhost:9000/websocket');
    
    this.webSocket.onmessage=(event) =>{
      this.message = JSON.parse(event.data)
      console.log(this.message)
    };
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
