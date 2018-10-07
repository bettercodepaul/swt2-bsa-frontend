import {Component, Input, OnInit} from '@angular/core';
import {AlertType} from '../types/alert-type.enum';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'bla-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  @Input() public id: string;
  @Input() public visible = true;
  @Input() public disabled = false;

  @Input() public header: string;
  @Input() public alertType: AlertType = AlertType.INFO;

  constructor() {
  }

  ngOnInit() {
  }

  public hasHeadline(): boolean {
    return !isNullOrUndefined(this.header);
  }

  public getAlertClass(): string {
    let alertClass = 'alert-primary';
    switch (this.alertType) {
      case AlertType.QUESTION:
        alertClass = 'alert-secondary';
        break;
      case AlertType.SUCCESS:
        alertClass = 'alert-success';
        break;
      case AlertType.WARNING:
        alertClass = 'alert-warning';
        break;
      case AlertType.DANGER:
        alertClass = 'alert-danger';
        break;
      // default
      case AlertType.INFO:
      default:
        alertClass = 'alert-primary';
    }

    return alertClass;
  }

  public getAlertHeadingIconClass(): string {
    let alertHeadingClass = 'fa-info-circle';
    switch (this.alertType) {
      case AlertType.QUESTION:
        alertHeadingClass = 'fa-question-circle';
        break;
      case AlertType.SUCCESS:
        alertHeadingClass = 'fa-check';
        break;
      case AlertType.WARNING:
        alertHeadingClass = 'fa-exclamation-triangle';
        break;
      case AlertType.DANGER:
        alertHeadingClass = 'fa-exclamation-circle';
        break;
      // default
      case AlertType.INFO:
      default:
        alertHeadingClass = 'fa-info-circle';
    }

    return alertHeadingClass;
  }
}
