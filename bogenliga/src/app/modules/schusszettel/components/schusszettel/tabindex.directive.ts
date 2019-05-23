import {Directive, ElementRef} from '@angular/core';
import {schuetzenNrIdxGen, ringzahlIdxGen} from './schusszettel.component';

export class TabIndexDirective {
  protected el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }
}

@Directive({
  selector: '[blaSchuetzenTabIndexDirective]'
})
export class SchuetzenTabIndexDirective extends TabIndexDirective{
  constructor(el: ElementRef) {
    super(el);
    this.el.nativeElement.setAttribute('tabindex', schuetzenNrIdxGen.getNext())
  }
}

@Directive({
  selector: '[blaRingzahlTabIndexDirective]'
})
export class RingzahlTabIndexDirective extends TabIndexDirective{
  constructor(el: ElementRef) {
    super(el);
    this.el.nativeElement.setAttribute('tabindex', ringzahlIdxGen.getNext())
  }
}
