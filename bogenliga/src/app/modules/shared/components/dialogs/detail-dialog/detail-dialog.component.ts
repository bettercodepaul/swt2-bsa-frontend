import {Component, Input, OnInit} from '@angular/core';
import {DetailDialogConfig} from '../types/detail-dialog-config.interface';
import {CurrentUserService} from '../../../services/current-user';
import {CommonSecuredComponent} from '../../common/common-secured-component.class';

@Component({
  selector:    'bla-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls:   ['./detail-dialog.component.scss']
})
export class DetailDialogComponent extends CommonSecuredComponent implements OnInit {

  @Input() public config: DetailDialogConfig;

  constructor(private currentUserService: CurrentUserService) {
    super(currentUserService);
  }

  ngOnInit() {
  }

}
