import {Directive, ElementRef, HostListener} from '@angular/core';
import {NumberOnlyDirective, PfeilNumberOnly} from './number.directive';
import {SchusszettelComponent} from '@sportjahresplan/components';

@Directive({
  selector: '[blaAutoswitch]'
})
export class AutoswitchDirective {
  constructor(private el: ElementRef) {
  }
}
