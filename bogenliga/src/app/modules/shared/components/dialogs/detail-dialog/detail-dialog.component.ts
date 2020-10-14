import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserService} from '../../../services/current-user';
import {CommonSecuredDirective} from '../../common/common-secured-component.class';
import {FormContent} from '../../forms';
import {DetailDialogConfig} from '../types/detail-dialog-config.interface';

@Component({
  selector:    'bla-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls:   ['./detail-dialog.component.scss']
})
export class DetailDialogComponent extends CommonSecuredDirective implements OnInit {

  @Input() public config: DetailDialogConfig;
  @Input() public formContent: FormContent;

  constructor(private currentUserService: CurrentUserService) {
    super(currentUserService);
  }

  ngOnInit() {
  }

}
