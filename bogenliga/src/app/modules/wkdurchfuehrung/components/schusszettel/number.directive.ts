import {Directive, ElementRef, HostListener} from '@angular/core';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';

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
  private focusTimeout: any;
  private focusMoved = false;

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
      id: 'NOTIFICATION_SCHUSSZETTEL_EINGABEFEHLER',
      title: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.EINGABEFEHLER.TITLE',
      description: 'WKDURCHFUEHRUNG.SCHUSSZETTEL.NOTIFICATION.EINGABEFEHLER.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    });
    event.preventDefault();
  }

  /** Check min/max range */
  public inRange(value) {
    return parseInt(value, 10) >= this.MIN_VAL && parseInt(value, 10) <= this.MAX_VAL;
  }

  /** Auto-select value when entering field */
  @HostListener('focus')
  onFocus() {
    const input = this.el.nativeElement as HTMLInputElement;
    setTimeout(() => {
      input.select();
    });
  }

  /** Default keydown handling (replace behavior) — used by most directives */
  protected handleKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    if (event.key === this.ALIAS_10) {
      this.el.nativeElement.value = '10';
      event.preventDefault();
      this.el.nativeElement.dispatchEvent(new Event('input', {bubbles: true}));
      return;
    }

    if (!this.allowedKeys.includes(event.key) || isNaN(Number(event.key))) {
      this.notificationMethod(event);
      return;
    }

    // ALWAYS replace old value
    this.el.nativeElement.value = event.key;
    event.preventDefault();
    this.el.nativeElement.dispatchEvent(new Event('input', {bubbles: true}));
  }

  /** Auto-focus next input once per field entry */
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key) || this.focusMoved) {
      return;
    }

    if (this.allowedKeys.includes(event.key) || this.inRange(this.el.nativeElement.value)) {
      const currentTabIndex = parseInt(this.el.nativeElement.getAttribute('tabindex'), 10);

      this.focusMoved = true; // block further auto-focus until blur

      setTimeout(() => {
        const next = document.querySelector(`[tabindex="${currentTabIndex + 1}"]`) as HTMLElement;
        next?.focus();
      }, 50);
    }
  }

  @HostListener('blur')
  onBlur() {
    this.focusMoved = false; // reset when user leaves field
  }

}


/**
 * Pfeil — supports alias "+" = 10
 */
@Directive({
  selector: '[blaPfeilNumberOnly]'
})
export class PfeilNumberOnlyDirective extends NumberOnlyDirective {

  constructor(el: ElementRef, notificationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 10, notificationService);
    this.ALIAS_10 = '+';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    super.handleKeyDown(event);
  }
}


/**
 * Schütze — 1–99
 */
@Directive({
  selector: '[blaSchuetzeNumberOnly]'
})
export class SchuetzeNumberOnlyDirective extends NumberOnlyDirective {

  constructor(el: ElementRef, notificationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 1, 99, notificationService);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    super.handleKeyDown(event);
  }
}


/**
 * Fehlerpunkte — allow multi-digit input up to 60
 */
@Directive({
  selector: '[blaFehlerNumberOnly]'
})
export class FehlerpunkteNumberOnlyDirective extends NumberOnlyDirective {

  private replaceNext = true; // track first keystroke after focus

  constructor(el: ElementRef, notificationService: NotificationService) {
    super(el, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 0, 60, notificationService);
  }

  @HostListener('focus')
  onFocus() {
    this.replaceNext = true;
    super.onFocus();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    if (!this.allowedKeys.includes(event.key) || isNaN(Number(event.key))) {
      this.notificationMethod(event);
      return;
    }

    const current = this.el.nativeElement.value ?? '';

    // ✅ first input after focus → replace
    if (this.replaceNext) {
      this.replaceNext = false;
      this.el.nativeElement.value = event.key;
      event.preventDefault();
      this.el.nativeElement.dispatchEvent(new Event('input', {bubbles: true}));
      return;
    }

    // ✅ subsequent input → append if still ≤ 60
    const nextValue = current + event.key;

    if (!this.inRange(nextValue)) {
      this.notificationMethod(event);
      return;
    }

    this.el.nativeElement.value = nextValue;
    event.preventDefault();
    this.el.nativeElement.dispatchEvent(new Event('input', {bubbles: true}));
  }
}

