import {Directive, ElementRef, HostListener} from '@angular/core';
import {NotificationOrigin, NotificationService, NotificationSeverity, NotificationType, NotificationUserAction} from '@shared/services';
/**
 * A element-directive to ensure only-number inputs.
 * Also controls the number-aliasing using '+' instead of 10 (1 keystroke instead of 2).
 */
@Directive({
  selector: '[blaMyNumberOnly]'
})
export class NumberOnlyDirective {
  public static specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right', 'Shift'];
  public static ALIAS_10 = '+';
  public static allowedKeys: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', NumberOnlyDirective.ALIAS_10];
  public static MIN_VAL = 0;
  public static MAX_VAL = 10;

  static inRange(value) {
    return (parseInt(value, 10) >= NumberOnlyDirective.MIN_VAL &&
      parseInt(value, 10) <= NumberOnlyDirective.MAX_VAL);
  }

  constructor(private el: ElementRef,
    private notificationService: NotificationService) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (NumberOnlyDirective.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (event.key === NumberOnlyDirective.ALIAS_10) {
      this.el.nativeElement.value = '10';
      return;
    } else if(!NumberOnlyDirective.allowedKeys.includes(event.key) || this.el.nativeElement.value + parseInt(event.key) > NumberOnlyDirective.MAX_VAL) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_EINGABEFEHLER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.EINGABEFEHLER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.EINGABEFEHLER.DESCRIPTION',
        severity:    NotificationSeverity.INFO,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.PENDING
      });
      event.preventDefault();
    }
  }
}
