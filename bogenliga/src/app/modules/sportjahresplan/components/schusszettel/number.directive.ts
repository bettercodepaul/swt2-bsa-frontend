import {Directive, ElementRef, HostListener} from '@angular/core';
import {NotificationOrigin, NotificationService, NotificationSeverity, NotificationType, NotificationUserAction} from '@shared/services';
/**
 * A element-directive to ensure only-number inputs.
 */
@Directive()
export class NumberOnlyDirective {

  protected el: ElementRef;
  protected notificationService;
  protected specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right', 'Shift'];
  protected allowedKeys: Array<string>;
  protected MIN_VAL: number; // min allowed value in fields
  protected MAX_VAL: number; // max allowed value in fields
  protected ALIAS_10 = '+';

  constructor(el: ElementRef, allowedKeys: Array<string>, MIN_VAL: number, MAX_VAL: number, notificationService: NotificationService) {
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
    return parseInt(value, 10) >= this.MIN_VAL && parseInt(value, 10) <= this.MAX_VAL;
  }

  /**
   * Handles keydown events for FehlerNumberOnly and SchuetzeNumberOnly,
   * fires notificationMethod if keydown was invalid.
   * @param event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    } else if (!this.allowedKeys.includes(event.key) || !this.inRange(this.el.nativeElement.value + parseInt(event.key, 10))) {
      this.notificationMethod(event);
    }
  }
  /**
   * Handles keyup events for PfeilNumberOnly, FehlerNumberOnly and SchuetzeNumberOnly, increases tabindex if keystroke was valid.
   * @param event
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Allow Backspace, tab, end and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (this.allowedKeys.includes(event.key) || this.inRange(this.el.nativeElement.value + parseInt(event.key, 10))) {
      const currentTabIndex = parseInt(this.el.nativeElement.getAttribute('tabindex'), 10);
      // @ts-ignore FIXME: dear TypeScript, .focus() DOES exist on Element -.-
      document.querySelector('[tabindex="' + (currentTabIndex + 1) + '"]').focus();
    }
  }
}


/**
 * A element-directive to ensure only-number inputs in passe.ringzahlPfeil fields.
 * Controls the number-aliasing using '+' instead of 10 (1 keystroke instead of 2).
 * Contains rules for allowed keystrokes.
 * Extends NumberOnlyDirective
 */
@Directive({
  selector: '[blaPfeilNumberOnly]'
})
export class PfeilNumberOnlyDirective extends NumberOnlyDirective {

  constructor(el: ElementRef, notifcationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 10, notifcationService);
    this.ALIAS_10 = '+';
  }

  /**
   * Override of onKeyDown Method from NumberOnlyDirective
   * @param event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (event.key === this.ALIAS_10) {
      this.el.nativeElement.value = '10';
      return;
    } else if (!this.allowedKeys.includes(event.key) || !this.inRange(this.el.nativeElement.value + parseInt(event.key, 10))) {
      this.notificationMethod(event);
    }
  }
}


/**
 * A element-directive to ensure only-number inputs in passe.schuetzeNr fields.
 * Extends NumberOnlyDirective
 */
@Directive({
  selector: '[blaSchuetzeNumberOnly]'
})
export class SchuetzeNumberOnlyDirective extends NumberOnlyDirective {

  constructor(el: ElementRef, notifcationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 1, 99, notifcationService);
  }
}


/**
 * A element-directive to ensure only-number inputs in match.fehlerpunkte fields.
 * Extends NumberOnlyDirective
 */
@Directive({
  selector: '[blaFehlerNumberOnly]'
})
export class FehlerpunkteNumberOnlyDirective extends NumberOnlyDirective {

  constructor(el: ElementRef, notifcationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 60, notifcationService);
  }
}
