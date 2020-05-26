import {Directive, ElementRef, HostListener} from '@angular/core';
import {NotificationOrigin, NotificationService, NotificationSeverity, NotificationType, NotificationUserAction} from '@shared/services';
/**
 * A element-directive to ensure only-number inputs.
 */
export class NumberOnlyDirective {

  protected el : ElementRef;
  protected notificationService;
  protected specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right', 'Shift'];
  protected allowedKeys : Array<string>;
  protected MIN_VAL : number;
  protected MAX_VAL : number;

  constructor(el: ElementRef, allowedKeys : Array<string>, MIN_VAL : number, MAX_VAL : number, notificationService : NotificationService) {
    this.el = el;
    this.notificationService = notificationService;
    this.allowedKeys = allowedKeys;
    this.MIN_VAL = MIN_VAL;
    this.MAX_VAL = MAX_VAL;
  }

  /**
   * Executes notificationService if the entered key was invalid.
   * @param event - Parse a keyboard key to the method
   */
  public notificationMethod(event: KeyboardEvent) {
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

  /**
   * Method to check if param value is in range of classes min and max values.
   * @param value
   */
  public inRange(value) {
    return parseInt(value) >= this.MIN_VAL && parseInt(value) <= this.MAX_VAL;
  }
}
/**
 * A element-directive to ensure only-number inputs in passe.ringzahlPfeil fields.
 * Controls the number-aliasing using '+' instead of 10 (1 keystroke instead of 2).
 * Contains rules for allowed keystrokes.
 */
@Directive({
  selector: '[blaPfeilNumberOnly]'
})
export class PfeilNumberOnly extends NumberOnlyDirective {

  private ALIAS_10;

  constructor(el: ElementRef, notifcationService : NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 10, notifcationService);
    this.ALIAS_10 = '+';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (event.key === this.ALIAS_10) {
      this.el.nativeElement.value = '10';
      return;
    } else if (!this.allowedKeys.includes(event.key) || !this.inRange(this.el.nativeElement.value + parseInt(event.key))) {
      this.notificationMethod(event);
    }
  }
}
/**
 * A element-directive to ensure only-number inputs in passe.schuetzeNr fields.
 * Contains rules for allowed keystrokes.
 */
@Directive({
  selector: '[blaSchuetzeNumberOnly]'
})
export class SchuetzeNumberOnly extends NumberOnlyDirective {

  constructor(el: ElementRef, notifcationService : NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 1, 99, notifcationService);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    } else if(!this.allowedKeys.includes(event.key) || !this.inRange(this.el.nativeElement.value + parseInt(event.key))) {
      this.notificationMethod(event);
    }
  }
}
/**
 * A element-directive to ensure only-number inputs in match.fehlerpunkte fields.
 * Contains rules for allowed keystrokes.
 */
@Directive({
  selector: '[blaFehlerNumberOnly]'
})
export class FehlerpunkteNumberOnly extends NumberOnlyDirective {

  constructor(el: ElementRef, notifcationService : NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 10, notifcationService);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    } else if(!this.allowedKeys.includes(event.key) || !this.inRange(this.el.nativeElement.value + parseInt(event.key))) {
      this.notificationMethod(event);
    }
  }
}
