import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[blamyNumberOnly]'
})
export class NumberOnlyDirective {
  // Allow decimal numbers and negative values and plus
  // nice regex (/^-?[0-9\+]+(\.[0-9]*)?$/g)
  private regex: RegExp = new RegExp(/^-?[0-9\+]+(\.[0-9]*)?$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home, 'Delete', 'ArrowLeft', 'ArrowRight'
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right' ];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
