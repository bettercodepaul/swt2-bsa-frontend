import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector:    'bla-migrationstatusbar',
  templateUrl: 'statusbar.component.html',
  styleUrls:['statusbar.component.scss']
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
}
