import {Component, OnInit} from '@angular/core';
import {WETTKAEMPFE_CONFIG} from './wettkaempfe.config';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification';
import {CommonComponent} from '../../../shared/components/common';

export * from '../setzliste-download/setzliste-download.component';

@Component({
  selector: 'bla-wettkaempfe',
  templateUrl: './wettkaempfe.component.html',
  styleUrls: [
    './../../../../app.component.scss',
    './wettkaempfe.component.scss'
  ]
})
export class WettkaempfeComponent extends CommonComponent implements OnInit {

  public config = WETTKAEMPFE_CONFIG;

  public pdf = new Blob();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
  }

}
