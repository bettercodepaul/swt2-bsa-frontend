import {Directive, ElementRef, HostListener} from '@angular/core';
import {NumberOnlyDirective} from './number.directive';

@Directive({
  selector: '[blaAutoswitch]'
})
export class AutoswitchDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (NumberOnlyDirective.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (NumberOnlyDirective.allowedKeys.indexOf(event.key) >= 0) {
      const nextVal: number = parseInt((event.key === NumberOnlyDirective.ALIAS_10) ? NumberOnlyDirective.MAX_VAL.toString() : event.key, 10);
      if (NumberOnlyDirective.inRange(nextVal)) {
        const currentTabIndex = parseInt(this.el.nativeElement.getAttribute('tabindex'), 10);
        // @ts-ignore FIXME: dear TypeScript, .focus() DOES exist on Element -.-
        document.querySelector('[tabindex="' + (currentTabIndex + 1) + '"]').focus();
      }
    }
  }
}
