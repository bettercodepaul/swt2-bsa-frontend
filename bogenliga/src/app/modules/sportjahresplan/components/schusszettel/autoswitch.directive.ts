import {Directive, ElementRef, HostListener} from '@angular/core';
import {NumberOnlyDirective, PfeilNumberOnly} from './number.directive';

@Directive({
  selector: '[blaAutoswitch]'
})
export class AutoswitchDirective {
  constructor(private el: ElementRef) {
  }
  /**
   * On key up, check if the value entered was valid and not special.
   * Then try to switch to the next input by incrementing the current elements tabindex value by 1.
   * @param event
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const currentTabIndex = parseInt(this.el.nativeElement.getAttribute('tabindex'), 10);
    // @ts-ignore FIXME: dear TypeScript, .focus() DOES exist on Element -.-
    document.querySelector('[tabindex="' + (currentTabIndex + 1) + '"]').focus();
  }
}
