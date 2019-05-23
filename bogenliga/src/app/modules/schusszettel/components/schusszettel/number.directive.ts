import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[blaMyNumberOnly]'
})
export class NumberOnlyDirective {
  public static specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right', 'Shift' ];
  public static ALIAS_10: string = '+';
  public static allowedKeys: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', NumberOnlyDirective.ALIAS_10];
  public static MIN_VAL: number = 0;
  public static MAX_VAL: number = 10;

  constructor(private el: ElementRef) {
  }

  static inRange (value) {
    return (parseInt(value) >= NumberOnlyDirective.MIN_VAL &&
      parseInt(value) <= NumberOnlyDirective.MAX_VAL)
  }

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (NumberOnlyDirective.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (event.key === NumberOnlyDirective.ALIAS_10) {
      this.el.nativeElement.value = '10';
      return;
    } else if (NumberOnlyDirective.allowedKeys.indexOf(event.key) >= 0) {
      const next: string = event.key;
      try {
        let nextVal = parseInt(next);
        if (!NumberOnlyDirective.inRange(nextVal)) {
          event.preventDefault();
          return;
        }
      } catch (e) {
        event.preventDefault();
      }
    }
  }
}
