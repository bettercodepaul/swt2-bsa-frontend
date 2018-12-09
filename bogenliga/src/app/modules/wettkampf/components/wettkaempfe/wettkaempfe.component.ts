import {Component, OnInit} from '@angular/core';
import {WETTKAEMPFE_CONFIG} from './wettkaempfe.config';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification';
import {SetzlisteDataProviderService} from '../../services/setzliste-data-provider.service';
import {CommonComponent} from '../../../shared/components/common';
import {Response} from '../../../shared/data-provider';

@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './wettkaempfe.component.html',
  styleUrls:   [
    './../../../../app.component.scss',
    './wettkaempfe.component.scss'
  ]
})
export class WettkaempfeComponent extends CommonComponent implements OnInit {

  public config = WETTKAEMPFE_CONFIG;

  public pdf = new Blob();

  constructor(private setzlisteDataProvider: SetzlisteDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
  }

  private getSetzlisteAsPDF(id: number) {
    console.warn('testerchen Dennis - getSetzlisteComponent');
    this.setzlisteDataProvider.getSetzlisteAsPDF(id)
       .then((response: Response<Blob>) => this.handleSuccess(response))
       .catch((response: Response<Blob>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<Blob>) {
    console.warn('testerchen Dennis - handleSuccess');
    this.pdf = response.payload;
    let tab = window.open();
    const fileUrl = URL.createObjectURL(this.pdf);
    tab.location.href = fileUrl;
    this.loading = false;
  }

  private handleFailure(response: Response<Blob>) {
    console.warn('testerchen Dennis - handleFailure');
    this.loading = false;

  }
}
