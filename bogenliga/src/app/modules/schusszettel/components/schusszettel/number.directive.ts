import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[blaMyNumberOnly]'
})
export class NumberOnlyDirective {
  public static specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right', 'Shift' ];
  public static ALIAS_10: string = '+';
  public static allowedKeys: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', NumberOnlyDirective.ALIAS_10];

  constructor(private el: ElementRef) {
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
      const current: string = this.el.nativeElement.value;
      const next: string = current.concat(event.key);
      try {
        let nextVal = parseInt(next);
        if (!(nextVal >= 0 && nextVal <= 10)) {
          event.preventDefault();
          return;
        }
      } catch (e) {
        event.preventDefault();
      }
    }
  }
}
