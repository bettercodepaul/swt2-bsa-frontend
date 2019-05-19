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
      let currentTabIndex = parseInt(this.el.nativeElement.getAttribute('tabindex'));
      document.querySelector('[tabindex="' + (currentTabIndex + 1) + '"]').focus(); // FIXME: dear TypeScript, focus() DOES exist
    }
  }
}
