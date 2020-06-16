import {Directive, ElementRef} from '@angular/core';

/**
 * Index generator for tabindex number generation,
 * required for tab order in schusszettel form.
 */
class IndexGenerator {
  indices: Array<number>;
  currIdx: number;

  public getNext() {
    if (this.currIdx < this.indices.length) {
      const item = this.indices[this.currIdx];
      this.currIdx += 1;
      return item;
    } else {
      this.currIdx = 0;
      return this.getNext();
    }
  }
}

/**
 * Incremented each time when used on a schuetzenNr field in the schusszettel-Formular
 */
class SchuetzenNrIndexGenerator extends IndexGenerator {
  constructor() {
    super();
    this.indices = [1, 2, 3, 34, 35, 36];
    this.currIdx = 0;
  }
}

/**
 * Incremented each time when used on a ringzahl field in the schusszettel-Formular
 */
class RingzahlIndexGenerator extends IndexGenerator {
  constructor() {
    super();
    const rows = [
      [4, 29], // top left first table, top right first table
      [6, 31], // mid left first table, mid right first table
      [8, 33], // bottom left first table, bottom right first table
      [37, 62], // top left second table, top right second table
      [39, 64], // mid left second table, mid right second table
      [41, 66], // bottom left second table, bottom right second table
    ];
    this.indices = [];
    for (const row of rows) {
      for (let i = row[0]; i <= row[1]; i += 6) {
        this.indices.push(i);
        this.indices.push(i + 1);
      }
    }
    this.currIdx = 0;
  }
}

const schuetzenNrIdxGen = new SchuetzenNrIndexGenerator();
const ringzahlIdxGen = new RingzahlIndexGenerator();

export class TabIndexDirective {
  protected el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }
}

/**
 * Element-directive for schuetzenNr inputs.
 * Sets the next available schuetzenNr tabindex value as HTML-Attribute.
 */
@Directive({
  selector: '[blaSchuetzenTabIndexDirective]'
})
export class SchuetzenTabIndexDirective extends TabIndexDirective {
  constructor(el: ElementRef) {
    super(el);
    this.el.nativeElement.setAttribute('tabindex', schuetzenNrIdxGen.getNext());
  }
}

/**
 * Element-directive for ringzahl inputs.
 * Sets the next available rinzahl tabindex value as HTML-Attribute.
 */
@Directive({
  selector: '[blaRingzahlTabIndexDirective]'
})
export class RingzahlTabIndexDirective extends TabIndexDirective {
  constructor(el: ElementRef) {
    super(el);
    this.el.nativeElement.setAttribute('tabindex', ringzahlIdxGen.getNext());
  }
}
